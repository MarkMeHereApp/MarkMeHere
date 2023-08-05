import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserAuthForm } from '@/components/ui/userAuthForm';
import Stars from '@/components/background/stars';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function LoginPage() {
  return (
    <>
      <div className="relative h-screen bg-black">
        <div className="absolute top-0 right-0 h-full w-full">
          <Stars />
        </div>
        <div className="flex items-center justify-center h-screen relative z-10">
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Sign into Attendify
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email & password below to login
                </p>
              </div>
              <UserAuthForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Register
                </Link>{' '}
                today!
              </p>
              {/* <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{' '}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-white"
                >
                  Privacy Policy
                </Link>
                .
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}