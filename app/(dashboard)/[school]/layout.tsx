import MainBar from '@/app/(dashboard)/[school]/components/main-bar';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { ThemeProvider } from '@/app/theme-provider';

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
      <ThemeProvider attribute="class" defaultTheme={darkTheme}>
        <MainBar darkTheme={darkTheme} lightTheme={lightTheme} />
        {children}
      </ThemeProvider>
    </>
  );
}
