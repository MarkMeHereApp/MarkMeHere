import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function Page({
  params
}: {
  params: { school: string; 'course-code': string };
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    throw new Error('No session found');
  }

  const course = await prisma.course.findFirst({
    where: { courseCode: params['course-code'] }
  });

  if (!course) {
    throw new Error('No course found');
  }

  const courseMember = await prisma.courseMember.findFirst({
    where: { email: session.user.email, courseId: course.id }
  });

  if (!courseMember || !course) {
    throw new Error('No course found');
  }

  const page = courseMember.role === 'student' ? '/student' : '/overview';

  redirect(`/${params.school}/${course.courseCode}${page}`);
}
