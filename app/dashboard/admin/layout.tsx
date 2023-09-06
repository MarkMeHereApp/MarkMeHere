import { Metadata } from 'next';
import CourseSwitcher from '@/app/dashboard/components/main-bar';

import { getServerSession } from 'next-auth/next';
import prisma from '@/prisma';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Dashboard to manage instructors'
};

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

  return (
    <>
      <CourseSwitcher />
      <div>This is the Admin layout! ^^^</div>
      {children}
    </>
  );
}
