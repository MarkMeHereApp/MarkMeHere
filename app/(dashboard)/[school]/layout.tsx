import { ThemeProvider } from './theme-provider';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import SchoolContextProvider from './context-school';

export default async function SchoolLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { school: string };
}) {
  const session = await getServerSession();

  const email = session?.user?.email;

  if (!email) {
    throw new Error('No email found in session');
  }

  const school = await prisma.globalSiteSettings.findFirst({
    where: { schoolAbbreviation: params.school }
  });

  if (!school) {
    redirect('/');
  }

  const darkTheme = school.darkTheme;
  const lightTheme = school.lightTheme;

  return (
    <>
      <SchoolContextProvider
        themes={{ light: lightTheme, dark: darkTheme }}
        schoolAbbreviation={school.schoolAbbreviation}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </SchoolContextProvider>
    </>
  );
}
