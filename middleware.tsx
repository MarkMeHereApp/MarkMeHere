// Without a defined matcher, this one line applies next-auth to the entire project.

// export { default } from 'next-auth/middleware'; // This is the only line needed to apply next-auth to the entire project.
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Applies next-auth only to matches routes, this can be regex
// Currently there are no pages that shouldn't be protected by next-auth so we match all pages.
// Here is the Next.Js documentation. https://nextjs.org/docs/app/building-your-application/routing/middleware

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  //If this returns true the user is allowed to access the admin dahsboard
  function middleware(req) {
    console.log(req.nextauth.token);
    console.log(req.nextUrl);

    //If user is not an admin redirect them
    if (
      req.nextUrl.pathname === '/dashboard/admin' &&
      req.nextauth.token?.role !== 'ADMIN'
    ) {
      //Here we can add a check for what role the user is
      //There role will determine where we redirect back to
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    //If user is not a faculty member redirect them
    if (
      req.nextUrl.pathname === '/dashboard/faculty' &&
      req.nextauth.token?.role !== 'FACULTY'
    ) {
      //Here we can add a check for what role the user is
      //There role will determine where we redirect back to
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    //If user is not a student redirect them
    if (
      req.nextUrl.pathname === '/dashboard/student' &&
      req.nextauth.token?.role !== 'STUDENT'
    ) {
      //Here we can add a check for what role the user is
      //There role will determine where we redirect back to
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return NextResponse.json(
      {
        message: 'User granted access through middleware'
      },
      {
        status: 200
      }
    );
  },
  {
    //This runs first. If the user has a valid JWT this returns true
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

//Our middleware needs to run over all routes besides signin/signup
// export const config = { matcher: ['/dashboard/:path*'] };
export const config = { matcher: ['/adminDash'] };
