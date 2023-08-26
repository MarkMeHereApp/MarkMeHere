import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from "bcryptjs-react";
import prisma from '@/prisma';

/*
Today we need to Throw the custom error
*/

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const email: string = credentials?.email ?? '';
        const password: string = credentials?.password ?? '';

        // Find the user with the provided email
        const user = await prisma.user.findUnique({
          where: { email }
        });
        //Throw email not found if user uis not found here

        //const user = { id: "1", name: "J Smith", email: "test@test" }

        //If user does not exist say "Cant find user associated with this email"
        // if (!user) {
        //   throw new Error(( 'email' ));
        // }

        //If email is found check if password is correct
        //If user exists and entered password matches hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],

  pages: {
    signIn: '/signin',
    newUser: '/auth/signup',
    error: '/auth/error'
  }
};
