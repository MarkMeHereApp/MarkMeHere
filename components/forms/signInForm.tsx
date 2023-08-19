'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"

import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignInForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<{[key: string]: boolean}>({});
  const router = useRouter();
  const {data: session} = useSession()
  const searchParams = useSearchParams();
  const callbackUrl = searchParams ? searchParams.get('callbackUrl') || '/' : '/';
  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  const errorType = searchParams ? searchParams.get('error') : null;
  let error = null;
  if (errorType) {
    switch(errorType) {
      case 'CredentialsSignin':
        error = 'Invalid credentials';
        break;
      // Add more cases as needed
      default:
        error = 'Unknown Error';
    }
  }

  useEffect(() => {
    if (session && router) {
      router.push('/');
    }
  }, [session, router]);

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(prevState => ({...prevState, credentials: true})); // Set loading to true at the start of the function
  try {
    await signIn('credentials', {
      email,
      password,
      callbackUrl,
    });
  } catch (error) {
    console.error('Unexpected Error: ', error);
  } finally {
    setIsLoading(prevState => ({...prevState, credentials: false})); // Set loading to false at the end of the function
  }
};

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          {error && (
            <Alert className="text-center text-red-500">
              <AlertDescription>
              Log In Error: {error}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-1">
            <div className="text-white text-sm font-bold mb-0">Email</div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@test is a valid email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading.credentials}
              required
              className="bg-black border text-white"
            />
          </div>
          <div className="grid gap-1">
            <div className="text-white text-sm font-bold mb-0">Password</div>
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="test is a valid password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading.credentials}
              required
              className="bg-black border text-white"
            />
          </div>
          <Button disabled={isLoading.credentials}>
            {isLoading.credentials && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-transparent bars px-2 text-white text-muted-foreground">
          Or continue with
        </span>
      </div>
      {
        /*
        In the future we should definitely add a ton of providers, Google, GitHub, Apple, etc... then let users implement the ones they one through env variables.
        Then we can also have Custom slots for custom login providers... just a thought
        */
      }
      <Button variant="outline" type="button" onClick={() => {setIsLoading(prevState => ({...prevState, github: true})); signIn("github")}} disabled={isLoading.github}>
        {isLoading.github ? (
          <>
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            <Icons.gitHub className="mr-2 h-4 w-4" />  
            GitHub
          </>
        )}
      </Button>
    </div>
  );
}

