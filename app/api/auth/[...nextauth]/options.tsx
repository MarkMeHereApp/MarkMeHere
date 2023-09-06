import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import type { NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import { Adapter } from 'next-auth/adapters';

function customPrismaAdapter(prisma: PrismaClient) {
  return {
    ...PrismaAdapter(prisma),
    createUser: (data: any) => {
      const role = 'ADMIN';
      return prisma.user.create({ data: { ...data, role: role } });
    }
  };
}

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter(prisma) as Adapter,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),

    ZoomProvider({
      clientId: process.env.ZOOM_CLIENT_ID as string,
      clientSecret: process.env.ZOOM_CLIENT_SECRET as string
    })

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

    //       // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
    //     }
    //   }
    // })
  ],
  //This runs when JWT is created
  //In theory this will store the role of the user in their JWT (Use this in middleware)
  //User now has role added to its type
  callbacks: {
    jwt({ token, user }) {
      if(user) token.role = user.role
      return token
    },
  },
  session: {
    strategy: 'jwt'
  },

  pages: {
    signIn: '/signin',
    newUser: '/dashboard/overview',
    error: '/error'
  }
};
