import '@/styles/globals.css';
import '@/styles/styles.scss';

import { Suspense } from 'react';
import { Open_Sans } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from './providers';
import CoursesContext from '@/app/course-context';

import { getServerSession } from 'next-auth/next';
import prisma from '@/prisma';

const OpenSans = Open_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js 13 + PlanetScale + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, PlanetScale, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession();
  const email = serverSession?.user?.email || '';

  // By fetching the CourseMemberships in this server component,
  // it will be immediately available when the user navigates to the website.
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

  const userSelectedCourseId = await prisma.user.findFirst({
    where: {
      email: email
    },
    select: {
      selectedCourseId: true
    }
  });

  return (
    <html lang="en" className={OpenSans.className}>
      <body className="h-full" suppressHydrationWarning={true}>
        <Suspense fallback="...">{}</Suspense>
        <div>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Providers>
              <CoursesContext
                userCourses={courses}
                userCourseMembers={courseMemberships}
                userSelectedCourseId={userSelectedCourseId?.selectedCourseId}
              >
                {children}
              </CoursesContext>
            </Providers>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
