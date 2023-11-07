import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  const session = await getServerSession();

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

  const coursesInOrganization = courses.filter(
    (courseEnrollment) =>
      courseEnrollment.course.organizationCode === params.organizationCode
  );

  if (!(coursesInOrganization.length === 0)) {
    redirect(`/${params.organizationCode}/create-first-course`);
  }

  const page =
    coursesInOrganization[0].role === 'student' ? '/student' : '/overview';

  redirect(
    `/${params.organizationCode}/${coursesInOrganization[0].course.courseCode}${page}`
  );
}
