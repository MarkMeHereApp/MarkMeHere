import MainBar from '@/app/(dashboard)/[school]/components/main-bar';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { ThemeProvider } from '@/app/theme-provider';
import prisma from '@/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { school: string };
}) {
  const findSchool = await prisma.globalSiteSettings.findUniqueOrThrow({
    where: { schoolAbbreviation: params.school }
  });

  if (!findSchool) {
    redirect('/');
  }

  const globalSiteSettings = await getGlobalSiteSettings_Server({
    darkTheme: true,
    lightTheme: true
  });
  const darkTheme = globalSiteSettings.darkTheme;
  const lightTheme = globalSiteSettings.lightTheme;

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme={darkTheme}>
        <MainBar darkTheme={darkTheme} lightTheme={lightTheme} />
        {children}
      </ThemeProvider>
    </>
  );
}
