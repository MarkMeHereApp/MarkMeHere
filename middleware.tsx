// export { default } from 'next-auth/middleware'; // This is the only line needed to apply next-auth to the entire project.
import { withAuth } from 'next-auth/middleware';
import { zSiteRoles } from './types/sharedZodTypes';

/* 
We have two layers of middleware

Layer one: NextJS middleware
Validation method: JWT (site roles)

This middleware file will handle access to routes using site wide roles.
This is a general middleware meant to protect pages and certain api routes
that cannot be validated using trpc middleware (e.g: course creation)

Layer two: TRPC middleware
Validation method: Input Params (courseId, lectureId)

TRPC middleware will validate specific endpoints that can only be accessed by 
course members with elevated privileges
*/

/*
We need to handle the situation where a student attempts to access 
the QR route and they are not a TA.
They will be able to access /qr 
 */

const roleToRoutes: Record<string, string[]> = {
  ADMIN: ['/admin', '/api/trpc/utils.deleteDatabase'],
  FACULTY: [
    '/overview',
    '/qr',
    '/submit',
    '/mark-attendance-status',
    '/manage-course-members',
    '/testing-playground',
    '/user-settings',
    '/api/trpc/attendanceToken.ValidateAndCreateAttendanceToken', //j
    '/api/trpc/courseMember.getCourseMemberRole', //j
    '/api/trpc/canvas.getCanvasCourses',
    '/api/trpc/course.createCourse',
    '/api/trpc/qr.CreateNewQRCode',
    '/api/trpc/lecture.CreateLecture',
    '/api/trpc/attendance.createOrUpdateSingleAttendanceEntry',
    '/api/trpc/attendance.createManyAttendanceRecords',
    '/api/trpc/courseMember.getCourseMemberRole',
    '/api/trpc/courseMember.getCourseMembersOfCourse',
    '/api/trpc/lecture.getAllLecturesAndAttendance',
    '/api/trpc/lecture.getAllLecturesAndAttendance,courseMember.getCourseMemberRole',
    '/api/trpc/courseMember.getCourseMembersOfCourse,lecture.getAllLecturesAndAttendance,courseMember.getCourseMemberRole',
    '/api/trpc/courseMember.getCourseMemberRole,courseMember.getCourseMembersOfCourse,lecture.getAllLecturesAndAttendance',
    '/api/trpc/lecture.getAllLecturesAndAttendance,courseMember.getCourseMembersOfCourse',
    '/api/trpc/lecture.getAllLecturesAndAttendance,courseMember.getCourseMemberRole,courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.getCourseMembersOfCourse,lecture.getAllLecturesAndAttendance',
    '/api/trpc/courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.createCourseMember',
    '/api/trpc/courseMember.deleteAllStudents',
    '/api/trpc/utils.deleteDatabase'
  ],
  STUDENT: [
    '/student',
    '/markAttendance',
    '/submit',
    '/api/trpc/attendanceToken.ValidateAndCreateAttendanceToken', //j
    '/api/trpc/courseMember.getCourseMemberRole', //j
    '/api/trpc/qr.CreateNewQRCode',
    '/api/trpc/lecture.CreateLecture',
    '/api/trpc/attendance.createOrUpdateSingleAttendanceEntry',
    '/api/trpc/attendance.createManyAttendanceRecords',
    '/api/trpc/lecture.getAllLecturesAndAttendance,courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.getCourseMembersOfCourse,lecture.getAllLecturesAndAttendance',
    '/api/trpc/attendance.getCourseMemberAttendanceEntriesOfCourse',
    '/api/trpc/courseMember.getCourseMembersOfCourse',
    '/api/trpc/courseMember.createCourseMember',
    '/api/trpc/courseMember.deleteAllStudents',
    '/api/trpc/utils.deleteDatabase'
  ]
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

  //In here we may need to ferry error parameters through to clientside pages
  //If qr code page fails the url param will be returned here and we can add it to
  //The route we redirect to
  // function middleware(req) {
  //   const role = req.nextauth.token?.role as string;
  //   const route = req.nextUrl.pathname;
  //   const errorParams = req.nextUrl.searchParams.get('qr-warning');
  //   const allowedRoutes = roleToRoutes[role];

  //   if (!allowedRoutes.includes(route)) {
  //     const redirectPath =
  //       defaultRoutes[role] + (errorParams ? `?qr-warning=${errorParams}` : '');
  //     return NextResponse.redirect(new URL(redirectPath, req.url));
  //   }
  // },
  {
    /*
    This runs first. 
    If the user has a valid JWT and role then go to middleware
    */
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false;
        }
        const role = zSiteRoles.safeParse(token.role);
        // Assuming zSiteRoles.parse returns a role string
        // Check if the role is valid and return a boolean value
        if (role?.success) {
          return true;
        }
        return false;
      }
    }
  }
);

//Our middleware needs to run over all routes besides signin/signup
export const config = {
  // Matches the entire project except for the routes between the | characters.
  matcher:
    '/((?!signin|submit|_next/static|_next/image|favicon.ico|api/trpc/attendanceToken|unauthorized-email).*)'
};
