import { Metadata } from 'next';
import CourseSwitcher from '@/app/dashboard/components/main-bar';

import LecturesContext from '@/app/dashboard/faculty/lecture-context';
import { getServerSession } from 'next-auth/next';
import prisma from '@/prisma';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession();
  const email = serverSession?.user?.email || '';

  // Fetch the CourseMember records
  const courseMemberships = await prisma.courseMember.findMany({
    where: {
      email: email,
      role: {
        in: ['professor', 'assistant']
      }
    }
  });

  // Extract the course IDs from the CourseMember records
  const courseIds = courseMemberships.map(
    (courseMember) => courseMember.courseId
  );

  // Fetch the courses using the extracted IDs
  const courses = await prisma.course.findMany({
    where: {
      id: {
        in: courseIds
      }
    }
  });

  return (
    <>
      <CourseSwitcher />
      <LecturesContext>{children}</LecturesContext>
    </>
  );
}
