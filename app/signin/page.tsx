import SignInForm from '@/app/signin/components/signInForm';
import prisma from '@/prisma';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';

export default async function SigninPage() {
  try {
    const providers = await prisma.authProviderCredentials.findMany({
      select: {
        displayName: true,
        key: true
      }
    });
    let bTempAdminSecretConfigured = false;
    if (process.env.FIRST_TIME_SETUP_ADMIN_PASSWORD) {
      bTempAdminSecretConfigured = true;
    }

    let demoModeConfigured = false;
    if (process.env.DEMO_MODE) {
      demoModeConfigured = true;
    }

    const globalSiteSettings = await getGlobalSiteSettings_Server({
      darkTheme: true,
      lightTheme: true
    });
    const darkTheme = globalSiteSettings.darkTheme;
    const lightTheme = globalSiteSettings.lightTheme;

    return (
      <>
        <SignInForm
          providers={providers}
          bHasTempAdminConfigured={bTempAdminSecretConfigured}
          bIsDemoMode={demoModeConfigured}
          darkTheme={darkTheme}
          lightTheme={lightTheme}
        />
      </>
    );
  } catch (error) {
    throw error; // This should never error, but I want to log it if it somehow does
  }
}
