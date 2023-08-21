import { GetServerSideProps } from 'next';
import { Metadata } from 'next';
import Image from 'next/image';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import SignInForm from '@/components/forms/signInForm';
import Stars from '@/components/background/stars';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProviders } from 'next-auth/react';


export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default async function SigninPage() {

  const providers = await getProviders();

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
