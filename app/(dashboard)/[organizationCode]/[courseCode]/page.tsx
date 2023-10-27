import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function Page({
  params
}: {
  params: { organizationCode: string; courseCode: string };
}) {
  const session = await getServerSession();

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
    throw new Error('No course Membership found');
  }

  const page = courseMember.role === 'student' ? '/student' : '/overview';

  redirect(`/${params.organizationCode}/${course.courseCode}${page}`);
}
