import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import FirstCourseCreation from './create-first-course/components/first-course-creation';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import NoCoursesAndUser from './components/no-courses-and-user';
import { zSiteRoles } from '@/types/sharedZodTypes';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  const authOptions = await getAuthOptions();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('No session found');
  }

  const organization = await prisma.organization.findFirst({
    where: { uniqueCode: params.organizationCode }
  });

  if (!organization) {
    throw new Error('No email found in session');
  }

  if (!organization.firstTimeSetupComplete) {
    redirect(`/${params.organizationCode}/first-time-setup`);
  }

  const courses = await prisma.courseMember.findMany({
    where: { email: session.user.email },
    include: { course: true }
  });

  const coursesEnrollments = courses.filter(
    (courseEnrollment) =>
      courseEnrollment.course.organizationCode === params.organizationCode
  );

  if (coursesEnrollments.length === 0) {
    if (session.user.role !== zSiteRoles.enum.admin) {
      return <NoCoursesAndUser />;
    }

    const foundCourse = await prisma.course.findFirst();

    if (!foundCourse) {
      redirect(`/${params.organizationCode}/create-first-course`);
    }

    redirect(`/${params.organizationCode}/${foundCourse.courseCode}/overview`);
  }

  const page =
    coursesEnrollments[0].role === 'student' ? '/student' : '/overview';

  redirect(
    `/${params.organizationCode}/${coursesEnrollments[0].course.courseCode}${page}`
  );
}
