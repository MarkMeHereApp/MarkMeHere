import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function Page({
  params
}: {
  params: { organizationCode: string; courseCode: string };
}) {
  const authOptions = await getAuthOptions();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('No session found');
  }

  const course = await prisma.course.findFirst({
    where: { courseCode: params.courseCode }
  });

  if (!course) {
    throw new Error('No course found');
  }

  const courseMember = await prisma.courseMember.findFirst({
    where: { email: session.user.email, courseId: course.id }
  });

  if (!courseMember) {
    if (session.user.role === zSiteRoles.Enum.admin) {
      redirect(`/${params.organizationCode}/${course.courseCode}/overview`);
    }
    throw new Error('No course Membership found');
  }

  const page =
    courseMember.role === zCourseRoles.Enum.student ? '/student' : '/overview';

  redirect(`/${params.organizationCode}/${course.courseCode}${page}`);
}
