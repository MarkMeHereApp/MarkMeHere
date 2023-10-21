import MainBar from '@/app/(dashboard)/components/main-bar';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const globalSiteSettings = await getGlobalSiteSettings_Server({
    darkTheme: true,
    lightTheme: true
  });
  const darkTheme = globalSiteSettings.darkTheme;
  const lightTheme = globalSiteSettings.lightTheme;

  return (
    <>
      <MainBar darkTheme={darkTheme} lightTheme={lightTheme} />
      {children}
    </>
  );
}
