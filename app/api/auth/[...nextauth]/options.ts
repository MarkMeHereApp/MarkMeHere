import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import type { AuthOptions, NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { Adapter, AdapterUser } from 'next-auth/adapters';
import bcrypt from 'bcrypt';
import { decrypt } from '@/utils/globalFunctions';
import { providerFunctions } from './built-in-next-auth-providers';
import prismaAdapterDefault from './adapters/prismaAdapter';
import prismaAdapterHashed from './adapters/prismaAdapterHashed';

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
  const defaultProviders = [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    })
  ] as AuthOptions['providers'];

  const dbProviders = await getBuiltInNextAuthProviders();
  defaultProviders.push(...dbProviders);

  return {
    adapter: prismaAdapterHashed(prisma) as Adapter,
    providers: defaultProviders,

    logger: {
      error(code, error) {
        if ('error' in error) {
          if ((error.error.message = 'MultipleEdu')) {
          }
        }
      }
    },

    // credentials are commented until normal auth is working perfectly
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. "Sign in with...")
    //   name: 'Credentials',
    //   // `credentials` is used to generate a form on the sign in page.
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   // You can pass any HTML attribute to the <input> tag through the object.
    //   credentials: {
    //     email: { label: 'Email', type: 'text' },
    //     password: { label: 'Password', type: 'password' }
    //   },
    //   async authorize(credentials) {
    //     const email: string = credentials?.email ?? '';
    //     const password: string = credentials?.password ?? '';

    //     // Find the user with the provided email
    //     const user = await prisma.user.findUnique({
    //       where: { email }
    //     });
    //     //Throw email not found if user uis not found here

    //     //const user = { id: "1", name: "J Smith", email: "test@test" }

    //     //If user does not exist say "Cant find user associated with this email"
    //     // if (!user) {
    //     //   throw new Error(( 'email' ));
    //     // }

    //     //If email is found check if password is correct
    //     //If user exists and entered password matches hashed password
    //     if (
    //       user &&
    //       user.password &&
    //       (await bcrypt.compare(password, user.password))
    //     ) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user;
    //     } else {
    //       // If you return null then an error will be displayed advising the user to check their details.
    //       return null;

    //     //If email is found check if password is correct
    //     //If user exists and entered password matches hashed password
    //     if (
    //       user &&
    //       user.password &&
    //       (await bcrypt.compare(password, user.password))
    //     ) {
    //       // Any object returned will be saved in `user` property of the JWT
    //       return user;
    //     } else {
    //       // If you return null then an error will be displayed advising the user to check their details.
    //       return null;

    //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    //     }
    //   }
    // })
    //When JWT is created store user role in the token
    callbacks: {
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
