import MainBar from '@/app/(dashboard)/[school]/components/main-bar';
import { ThemeProvider } from '@/app/theme-provider';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import CoursesContext from './context-course';
import LecturesContext from './context-lecture';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { school: string; 'course-code': string };
}) {
  const session = await getServerSession();

  const email = session?.user?.email;

  if (!email) {
    throw new Error('No email found in session');
  }

  const school = await prisma.globalSiteSettings.findFirst({
    where: { schoolAbbreviation: params.school }
  });

  if (!school) {
    redirect('/');
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
    (membership) => membership.course.courseCode === params['course-code']
  );

  if (!courseEnrollment) {
    redirect('/');
  }

  const darkTheme = school.darkTheme;
  const lightTheme = school.lightTheme;

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme={darkTheme}>
        <CoursesContext
          userCourseMembers={courseMembershipShips}
          userCourses={courses}
        >
          <LecturesContext>
            <MainBar darkTheme={darkTheme} lightTheme={lightTheme} />
            {children}
          </LecturesContext>
        </CoursesContext>
      </ThemeProvider>
    </>
  );
}
