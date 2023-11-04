import MainBar from './components/main-bar';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CoursesContext from './context-course';
import LecturesContext from './context-lecture';

export default async function CourseLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string; courseCode: string };
}) {
  const session = await getServerSession();

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

  const courses = courseMembershipShips.map((membership) => membership.course);

  const courseEnrollment = courseMembershipShips.find(
    (membership) => membership.course.courseCode === params.courseCode
  );

  if (!courseEnrollment) {
    throw new Error('No Course Enrollment Found!');
  }

  return (
    <>
      <CoursesContext
        userCourseMembers={courseMembershipShips}
        userCourses={courses}
        selectedCourseEnrollment={courseEnrollment}
      >
        <LecturesContext>
          <MainBar />
          {children}
        </LecturesContext>
      </CoursesContext>
    </>
  );
}
