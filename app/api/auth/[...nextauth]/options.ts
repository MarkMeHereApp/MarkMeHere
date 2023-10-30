import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import type { AuthOptions, NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { Adapter } from 'next-auth/adapters';
import { decrypt, getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { providerFunctions } from './built-in-next-auth-providers';
import prismaAdapterDefault from './adapters/prismaAdapterDefault';
import prismaAdapterHashed from './adapters/prismaAdapterHashed';
import { findHashedUser } from '@/server/utils/hashedUserHelpers';
import CredentialsProvider from './customNextAuthProviders/credentials-provider';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { findDefaultUser } from '@/server/utils/defaultUserHelpers';
import { findDefaultCourseMember } from '@/server/utils/defaultCourseMemberHelpers.ts';
import { findHashedCourseMember } from '@/server/utils/hashedCourseMemberHelpers.ts';

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

  const settings = await getGlobalSiteSettings_Server({ hashEmails: true });
  console.log(settings);

  const prismaAdapter = settings.hashEmails
    ? (prismaAdapterHashed(prisma) as Adapter)
    : (prismaAdapterDefault(prisma) as Adapter);
  console.log(settings.hashEmails);

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
        const { hashEmails } = await getGlobalSiteSettings_Server({
          hashEmails: true
        });

        const prismaUser = hashEmails
          ? await findHashedUser(user.email)
          : await findDefaultUser(user.email);

        if (prismaUser) {
          return true;
        }

        const courseMember = hashEmails
          ? await findDefaultCourseMember(user.email)
          : await findHashedCourseMember(user.email);

        if (courseMember) {
          await prisma.user.create({
            data: {
              name: user.name,
              email:courseMember.email,
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
