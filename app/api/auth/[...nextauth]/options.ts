import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import type { AuthOptions, NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { Adapter } from 'next-auth/adapters';
import { decrypt } from '@/utils/globalFunctions';
import { providerFunctions } from './built-in-next-auth-providers';
import prismaAdapterDefault from './adapters/prismaAdapterDefault';
import prismaAdapterHashed from './adapters/prismaAdapterHashed';
import CredentialsProvider from './customNextAuthProviders/credentials-provider';
import { clientCallTypeToProcedureType } from '@trpc/client';
import { zSiteRoles } from '@/types/sharedZodTypes';
/* Check env to choose adapter */
const prismaAdapter =
  process.env.HASHEMAILS === 'true'
    ? (prismaAdapterHashed(prisma) as Adapter)
    : (prismaAdapterDefault(prisma) as Adapter);

const getBuiltInNextAuthProviders = async (): Promise<
  AuthOptions['providers']
> => {
  const builtInAuthProviders = [] as AuthOptions['providers'];

  const providers = await prisma.authProviderCredentials.findMany({
    where: {
      enabled: true
    }
  });

  providers.forEach((provider) => {
    const providerFunction = providerFunctions.find(
      (providerFunction) => providerFunction.key === provider.key
    );

    if (!providerFunction) {
      throw new Error(`Provider ${provider.key} not found`);
    }

    builtInAuthProviders.push(
      providerFunction.config({
        clientId: decrypt(provider.clientId) as string,
        clientSecret: decrypt(provider.clientSecret) as string,
        allowDangerousEmailAccountLinking:
          provider.allowDangerousEmailAccountLinking
      })
    );
  });
  return builtInAuthProviders;
};

export const getAuthOptions = async (): Promise<NextAuthOptions> => {
  const defaultProviders: AuthOptions['providers'] = [];

  const dbProviders = await getBuiltInNextAuthProviders();
  defaultProviders.push(...dbProviders);
  defaultProviders.push(CredentialsProvider);

  return {
    adapter: prismaAdapter,
    providers: defaultProviders,

    logger: {
      error(code, error) {
        if ('error' in error) {
          if ((error.error.message = 'MultipleEdu')) {
          }
        }
      }
    },

    //When JWT is created store user role in the token
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        const prismaUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (prismaUser) {
          return true;
        }

        const courseMember = await prisma.courseMember.findFirst({
          where: {
            email: user.email
          }
        });

        if (courseMember) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              role: zSiteRoles.enum.user,
              image: user.image
            }
          });
          return true;
        }

        // We need to allow first time admin setups through next-auth
        if (
          credentials?.tempAdminKey &&
          process.env.FIRST_TIME_SETUP_ADMIN_PASSWORD
        ) {
          return true;
        }

        // We need to allow demo logins through next-auth
        if (
          credentials?.demoLogin &&
          process.env.DEMO_MODE?.toString() === 'true'
        ) {
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              role: user.role,
              image: user.image
            }
          });
          return true;
        }

        return '/unauthorized-email?email=' + user.email;
      },
      jwt({ token, user }) {
        if (user) token.role = user.role;
        return token;
      }
    },
    session: {
      strategy: 'jwt'
    },

    pages: {
      signIn: '/signin',
      newUser: '/',
      error: '/'
    }
  };
};
