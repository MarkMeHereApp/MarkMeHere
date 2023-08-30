import { Metadata } from 'next';
import TeamSwitcher from '@/app/dashboard/components/main-bar';
import { getServerSession } from 'next-auth/next';
import { Course } from '@/utils/sharedTypes';
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

  const courses: Course[] = (
    await prisma.courseMember.findMany({
      where: {
        email: email,
        role: {
          in: ['professor', 'assistant']
        }
      },
      include: {
        course: true
      }
    })
  )
    .map((courseMember) => {
      if (courseMember.course) {
        return {
          id: courseMember.course.id,
          name: courseMember.course.name,
          loggedInUserRole: courseMember.role
        };
      }
    })
    .filter(Boolean) as Course[];

  return (
    <>
      <TeamSwitcher groups={courses}>{children}</TeamSwitcher>
    </>
  );
}
