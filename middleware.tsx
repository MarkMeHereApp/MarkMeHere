// export { default } from 'next-auth/middleware'; // This is the only line needed to apply next-auth to the entire project.
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const roleToRoutes: Record<string, string[]> = {
  ADMIN: ['/admin'],
  FACULTY: [
    '/overview',
    '/qr',
    '/mark-attendance-status',
    '/manage-course-members',
    '/testing-playground',
    '/user-settings',
    '/api/trpc/course.createCourse',
    '/api/trpc/lecture.CreateLecture',
    '/api/trpc/lecture.getAllLecturesAndAttendance,courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.getCourseMembersOfCourse,lecture.getAllLecturesAndAttendance',
    '/api/trpc/courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.createCourseMember',
    '/api/trpc/courseMember.deleteAllStudents',
    '/api/trpc/canvas.getCanvasCourses',
    '/api/trpc/qr.CreateNewQRCode'
  ],
  STUDENT: ['/student', '/markAttendance']
};

//Redirect to these routes based on role if unauthorized
const defaultRoutes: Record<string, string> = {
  ADMIN: '/admin',
  FACULTY: '/overview',
  STUDENT: '/student'
};

export default withAuth(
  /* 
  Grab all allowed routes based on user role
  check if request route matches an allowed route
  If the route is not allowed redirect
  */
  // function middleware(req) {
  //   const role = req.nextauth.token?.role as string;
  //   const route = req.nextUrl.pathname;
  //   const allowedRoutes = roleToRoutes[role];

  //   if (!allowedRoutes.includes(route)) {
  //     const redirectPath = defaultRoutes[role];
  //     return NextResponse.redirect(new URL(redirectPath, req.url));
  //   }
  // },
  {
    /*
    This runs first. 
    If the user has a valid JWT and role then go to middleware
    */
    callbacks: {
      authorized: ({ token }) =>
        !!token &&
        (token.role === 'STUDENT' ||
          token.role === 'FACULTY' ||
          token.role === 'ADMIN')
    }
  }
);

//Our middleware needs to run over all routes besides signin/signup
export const config = {
  // Matches the entire project except for the routes between the | characters.
  matcher: '/((?!api/submit|signin|_next/static|_next/image|favicon.ico).*)'
};
