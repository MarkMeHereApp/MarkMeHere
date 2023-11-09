import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import type { AuthOptions, NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { Adapter } from 'next-auth/adapters';
import { decrypt, getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { providerFunctions } from './built-in-next-auth-providers';
import prismaAdapterDefault from './adapters/prismaAdapterDefault';
import prismaAdapterHashed from './adapters/prismaAdapterHashed';
import { findUser, hashEmail } from '@/server/utils/userHelpers';
import CredentialsProvider from './customNextAuthProviders/credentials-provider';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { findCourseMember } from '@/server/utils/courseMemberHelpers';
import { findHashedCourseMember } from '@/server/utils/courseMemberHelpers';
import { AdapterUser } from 'next-auth/adapters';

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

  //Placeholder for now. Need to figure out how to grab user specific organization
  const settings = await prisma.organization.findFirst();

  const prismaAdapter = settings?.hashEmails
    ? (prismaAdapterHashed(prisma) as Adapter)
    : (prismaAdapterDefault(prisma) as Adapter);

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
        let hashedEmail = null;

        /*
        We can receive two types of user objects AdapterUser or User
        User comes from the provider, AdapterUser comes from the database
        If dateCreated is in user we know its the user row from our database 
        and it is already hashed (user from provider does not have dateCreated as an attribute)
       */
        if (settings?.hashEmails) {
          hashedEmail =
            'dateCreated' in user ? user.email : hashEmail(user.email);
        }

        const prismaUser = await findUser(hashedEmail ?? user.email);

        if (prismaUser) {
          return true;
        }
        // We need to allow first time admin setups through next-auth
        if (credentials?.tempAdminKey && process.env.ADMIN_RECOVERY_PASSWORD) {
          return true;
        }
        const organization = await prisma.organization.findFirst({
          where: { firstTimeSetupComplete: true }
        });

        if (!organization) {
          return true;
        }

        return '/unauthorized-email?email=' + user.email;
      },
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token, user }) {
        if (session.user) {
          session.user.role = token.role as string;
        }
        return session;
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
