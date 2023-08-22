import { Metadata } from 'next';

import SignInForm from '@/app/api/auth/signin/signInForm';
import Stars from '@/components/background/stars';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { getProviders } from 'next-auth/react';


export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};


// For some reason  when building the Next.Js app this page is being statically generated
// which spits out a fetch error, maybe because that endpoint is not available at build time?
// So we set the cache: "no-store" for the endpoint to be called everytime the page is loaded.
async function fetchProviders() {
  try {
    const providers = await fetch(process.env.NEXTAUTH_URL + '/api/auth/providers', {
      cache: "no-store",
    });
    return providers.json();
  } catch (error) {
    console.error('Failed to fetch providers:', error);
    // Handle or throw the error as appropriate for your application
  }
}

export default async function SigninPage() {

  const providers = await fetchProviders();

  return (
    <>
      <div className="relative h-screen">
        <div className="absolute top-0 right-0 h-full w-full">
          <Stars />
        </div>
        <Card className="w-[400px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
            <CardContent>
              <div className="flex flex-col space-y-2 text-center p-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign into Attendify
                </h1>
              </div>
              <SignInForm providers={providers} />

              {/* This is currently disabled because we don't want users to register (yet)
              <p className="px-8 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="underline underline-offset-4"
                >
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
