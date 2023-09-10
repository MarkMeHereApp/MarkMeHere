import MainBarAdmin from '@/app/dashboard/admin/components/layout/MainBarAdmin';

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

  return (
    <>
      <MainBarAdmin />
      <div>This is the Admin layout! ^^^</div>
      {children}
    </>
  );
}
