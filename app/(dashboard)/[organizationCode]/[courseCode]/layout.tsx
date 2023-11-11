import MainBar from './components/main-bar';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CoursesContext from './context-course';
import LecturesContext from './context-lecture';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { Course, CourseMember } from '@prisma/client';

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

  return (
    <>
      <CoursesContext
        userCourseMembers={courseMembershipShips}
        userCourses={courses}
        selectedCourseEnrollment={courseEnrollment}
        selectedCourse={selectedCourse}
      >
        <LecturesContext>
          <MainBar />
          {children}
        </LecturesContext>
      </CoursesContext>
    </>
  );
}
