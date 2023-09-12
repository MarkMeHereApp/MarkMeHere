import SignInForm from '@/app/signin/components/signInForm';

export default async function SigninPage() {
  try {
    const response = await fetch(
      process.env.NEXTAUTH_URL + '/api/auth/providers'
    );
    const providersData = await response.json();

    return (
      <>
        <SignInForm providers={providersData} />
      </>
    );
  } catch (error) {
    throw error; // This should never error, but I want to log it if it somehow does
  }
}
