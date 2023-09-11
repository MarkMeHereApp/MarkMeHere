import dynamic from 'next/dynamic';
import SignInForm from '@/app/signin/components/signInForm';
import { Card, CardContent } from '@/components/ui/card';

import { firaSansFont } from '@/utils/fonts';

export default async function SigninPage() {
  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });

  const response = await fetch(
    process.env.NEXTAUTH_URL + '/api/auth/providers'
  );
  const providersData = await response.json();

  return (
    <>
      <div className="relative h-screen">
        <div className="absolute top-0 right-0 h-full w-full">
          <Stars />
        </div>
        <Card className="w-[400px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
          <CardContent>
            <div className="flex flex-col space-y-2 text-center p-3">
              <span className={firaSansFont.className}>
                <h1
                  className={`text-2xl font-semibold font-logo tracking-tight`}
                >
                  Sign in Mark Me Here!
                </h1>
              </span>
            </div>
            <SignInForm providers={providersData} />

            {/* Enabled again for now so a single professsor IE Leinecker
            can sign up (mostly for testing) 
            <p className="px-8 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>{' '}
              today!
            </p>
            */}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
