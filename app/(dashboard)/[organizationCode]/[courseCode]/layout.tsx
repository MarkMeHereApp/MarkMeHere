import MainBar from './components/main-bar';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CoursesContext from './context-course';
import LecturesContext from './context-lecture';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { Course, CourseMember } from '@prisma/client';
import { getCourseWithEnrollments } from '@/data/courseMember/get-course-with-enrollments';

export default async function CourseLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string; courseCode: string };
}) {
  const authOptions = await getAuthOptions();

  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  if (!email) {
    throw new Error('No email found in session');
  }

  // By fetching the CourseMemberships in this server component,
  // it will be immediately available when the user navigates to the website.
  const courseMembershipShips = await prisma.courseMember.findMany({
    where: {
      email: email
    },
    include: {
      course: true
    }
  });

  //Get Available Courses, if the user is an admin, get all courses, otherwise get the courses the user is enrolled in.
  let courses: Course[] = [];
  if (session.user.role === zSiteRoles.enum.admin) {
    courses = await prisma.course.findMany({
      where: { organizationCode: params.organizationCode }
    });
  } else {
    courses = courseMembershipShips.map((membership) => membership.course);
  }

  const courseEnrollment = courseMembershipShips.find(
    (membership) => membership.course.courseCode === params.courseCode
  );

  // If the user is an admin, they can access any course, so we need to check if the course exists.
  let selectedCourse = courseEnrollment?.course;

  if (!selectedCourse) {
    if (session.user.role === zSiteRoles.enum.admin) {
      const course = await prisma.course.findFirst({
        where: {
          courseCode: params.courseCode,
          organizationCode: params.organizationCode
        }
      });

      if (!course) {
        redirect('/');
      }

      selectedCourse = course;
    } else {
      throw new Error('No Course Enrollment Found!');
    }
  }

  // Get Course + Enrollments of the selected course.
  const courseOfSelectedCourse = await getCourseWithEnrollments({
    courseCode: params.courseCode
  });

  if (!courseOfSelectedCourse.course) {
    throw new Error('No course found');
  }

  return (
    <>
      <CoursesContext
        userCourseMembers={courseMembershipShips}
        userCourses={courses}
        selectedCourseEnrollment={courseEnrollment}
        selectedCourse={selectedCourse}
        courseMembersOfSelectedCourse={
          courseOfSelectedCourse.course?.enrollments || []
        }
      >
        <LecturesContext>
          <MainBar />
          {children}
        </LecturesContext>
      </CoursesContext>
    </>
  );
}
