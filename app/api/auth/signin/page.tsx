'use client';

import { Metadata } from 'next';
import Link from 'next/link';

import SignInForm from '@/app/api/auth/signin/signInForm';
import Stars from '@/components/background/stars';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function SigninPage() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch('/api/auth/providers', {
          cache: 'no-store'
        });
        const providersData = await response.json();
        setProviders(providersData);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        // Handle or throw the error as appropriate for your application
      }
    }

    fetchProviders();
  }, []);

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

            {/* Enabled again for now so a single professsor IE Leinecker
            can sign up (mostly for testing) */}
            <p className="px-8 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/api/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>{' '}
              today!
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
