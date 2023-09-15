// Without a defined matcher, this one line applies next-auth to the entire project.

// export { default } from 'next-auth/middleware'; // This is the only line needed to apply next-auth to the entire project.
import { withAuth } from 'next-auth/middleware';

// Applies next-auth only to matches routes, this can be regex
// Currently there are no pages that shouldn't be protected by next-auth so we match all pages.
// Here is the Next.Js documentation. https://nextjs.org/docs/app/building-your-application/routing/middleware

//Redirect to these routes based on role if unauthorized

// const roleToRoute: Record<string, string> = {
//   ADMIN: '/dashboard/admin',
//   FACULTY: '/dashboard/faculty/overview',
//   STUDENT: '/dashboard/student'
// };

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  //If this returns true the user is allowed to access the admin dahsboard
  //function middleware(req) {
  // console.log(req.nextauth.token);
  // console.log(req.nextUrl);
  // const role = req.nextauth.token?.role as string;
  // const path = req.nextUrl.pathname;

  //If user is not an admin redirect them
  // if (path.startsWith('/dashboard/admin') && role !== 'ADMIN') {
  //   //Redirect user back to the home path specified by their role
  //   const url = req.nextUrl.clone();
  //   url.pathname = roleToRoute[role];
  //   return NextResponse.redirect(url);
  // }

  //If user is not a faculty member redirect them
  // if (path.startsWith('/dashboard/faculty') && role !== 'FACULTY') {
  //   const url = req.nextUrl.clone();
  //   url.pathname = roleToRoute[role];
  //   return NextResponse.redirect(url);
  // }

  //If user is not a student redirect them
  // if (path.startsWith('/dashboard/student') && role !== 'STUDENT') {
  //   const url = req.nextUrl.clone();
  //   url.pathname = roleToRoute[role];
  //   return NextResponse.redirect(url);
  // }

  //return NextResponse.redirect(req.nextUrl);

  // return NextResponse.json(
  //   {
  //     message: 'User granted access through middleware'
  //   },
  //   {
  //     status: 200
  //   }
  // );
  // },
  {
    //This runs first. If the user has a valid JWT this returns true
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

//Our middleware needs to run over all routes besides signin/signup
// export const config = { matcher: ['/dashboard/:path*'] };
export const config = {
  // Matches the entire project except for the routes between the | characters.
  matcher: '/((?!api/submit|signin|_next/static|_next/image|favicon.ico).*)'
};
