import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import NoCourse from './components/no-course';
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

  const firstCourse = await prisma.courseMember.findFirst({
    where: { email: session.user.email },
    include: { course: true }
  });

  if (!firstCourse) {
    return <NoCourse />;
  }

  const page = firstCourse.role === 'student' ? '/student' : '/overview';

  redirect(
    `/${params.organizationCode}/${firstCourse.course.courseCode}${page}`
  );
}
