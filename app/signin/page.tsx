import SignInForm from '@/app/signin/components/signInForm';
import prisma from '@/prisma';

export default async function SigninPage() {
  try {
    const response = await fetch(
      process.env.NEXTAUTH_URL + '/api/auth/providers'
    );
    const providersData = await response.json();

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

    return (
      <>
        <SignInForm providers={providers} />
      </>
    );
  } catch (error) {
    throw error; // This should never error, but I want to log it if it somehow does
  }
}
