import CourseSwitcher from '@/app/dashboard/components/main-bar';

import LecturesContext from '@/app/dashboard/faculty/lecture-context';
import { getServerSession } from 'next-auth/next';
import prisma from '@/prisma';
import { usePathname } from 'next/navigation'; // Import the useRouter hook

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession();
  const email = serverSession?.user?.email || '';
  // A helper function to determine if the link is active
  const isQRCodeActive = usePathname() === '/dashboard/faculty/qr-code';

  // Fetch the CourseMember records
  const courseMemberships = await prisma.courseMember.findMany({
    where: {
      email: email,
      role: {
        in: ['professor', 'assistant']
      }
    }
  });

  // Extract the course IDs from the CourseMember recgit ords
  const courseIds = courseMemberships.map(
    (courseMember) => courseMember.courseId
  );

  // Fetch the courses using the extracted IDs
  const _courses = await prisma.course.findMany({
    where: {
      id: {
        in: courseIds
      }
    }
  });

  return (
    <>
      {!isQRCodeActive && <CourseSwitcher />}
      <LecturesContext>{children}</LecturesContext>
    </>
  );
}


