import { Metadata } from 'next';
import TeamSwitcher from '@/app/dashboard/components/main-bar';

import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard to manage your classes'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession();
  const prisma = new PrismaClient();
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
      <TeamSwitcher />
      {children}
    </>
  );
}
