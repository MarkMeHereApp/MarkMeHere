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

    /*
     * @TODO This should be removed when we handle no providers being available... this is just temporary because in
     * auth/[...nextauth]/options.ts we are manually adding the GitHub provider, but we don't want to do that in production
     */
    providers.push({
      key: 'github',
      displayName: 'GitHub (This provider was manually Added)'
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
