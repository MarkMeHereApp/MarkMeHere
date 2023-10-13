import SignInForm from '@/app/signin/components/signInForm';
import prisma from '@/prisma';

export default async function SigninPage() {
  try {
    const providers = await prisma.authProviderCredentials.findMany({
      select: {
        displayName: true,
        key: true
      }
    });
    let tempAdminSecretConfigured = false;
    if (process.env.TEMP_ADMIN_SECRET) {
      tempAdminSecretConfigured = true;
    }

    return (
      <>
        <SignInForm
          providers={providers}
          bHasTempAdminConfigured={tempAdminSecretConfigured}
        />
      </>
    );
  } catch (error) {
    throw error; // This should never error, but I want to log it if it somehow does
  }
}
