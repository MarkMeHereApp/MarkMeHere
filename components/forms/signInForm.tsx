'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from "next-auth/react"

import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignInForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const {data: session} = useSession()

  useEffect(() => {
    if (session && router) {
      router.push('/');
    }
  }, [session, router]);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Get form data
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    console.log('client form data:', formData);

    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        body: formData
      });

      // Handle success response
      console.log('Sign in successful');

      router.push('/');
    } catch (error) {
      console.error('error signing in:', error);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <div className="text-white text-sm font-bold mb-0">Email</div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
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
              placeholder="*********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-black border text-white"
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
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
      <Button variant="outline" type="button" onClick={() => signIn("github")}>
        <Icons.gitHub className="mr-2 h-4 w-4" />  
        GitHub
      </Button>
    </div>
  );
}
