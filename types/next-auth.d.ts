import NextAuth from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { User } from 'next-auth';

/*
Override the user type nextauth uses
*/
declare module 'next-auth' {
  interface User {
    id: string;
    optionalId?: string | null;
    role: string;
    name?: string | null;
    email: string;
    image?: string | null;
    dateCreated?: Date | null;
    selectedCourseId?: string | null;
  }
  interface Session {
    user: {
      email: string;
      name: string;
      image: string;
      role: string;
    };
  }
}

/*
 We need to make email verified optional because we dont want it on our user object
 */
declare module 'next-auth/adapters' {
  interface AdapterUser extends User {
    id: string;
    email: string;
    emailVerified?: date | null;
  }
}
