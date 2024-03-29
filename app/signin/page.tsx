import SignInForm from '@/app/signin/components/signInForm';
import prisma from '@/prisma';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function SigninPage() {
  try {

    revalidatePath('/', "layout");
    revalidatePath('/', "page");


    const providers = await prisma.authProviderCredentials.findMany({
      select: {
        displayName: true,
        key: true
      }
    });
    let bTempAdminSecretConfigured = false;
    if (process.env.ADMIN_RECOVERY_PASSWORD) {
      bTempAdminSecretConfigured = true;
    }

    let demoModeConfigured = false;
    if (process.env.NEXT_PUBLIC_DEMO_MODE) {
      demoModeConfigured = true;
    }

    // When we have multiple organizations, we should check the organization on an individual basis.
    const organization = await prisma.organization.findFirst({
      where: { firstTimeSetupComplete: true }
    });

    return (
      <>
        <SignInForm
          providers={providers}
          bOrganizationFullyConfigured={!!organization}
          bHasTempAdminConfigured={bTempAdminSecretConfigured}
          bIsDemoMode={demoModeConfigured}
        />
      </>
    );
  } catch (error) {
    throw error; // This should never error, but I want to log it if it somehow does
  }
}
