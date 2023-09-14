'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SignUpForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Get form data
    const formData = new FormData(event.currentTarget as HTMLFormElement);

    try {
      const _response = await fetch('/signup/api', {
        method: 'POST',
        body: formData
      });

      // Handle success response

      router.push('/overview');
    } catch (error) {
      console.error('error signing up:', error);
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
            <div className="text-white text-sm mb-0">First Name</div>
            <Label className="sr-only" htmlFor="firstname">
              First Name
            </Label>
            <Input
              id="firstname"
              name="firstname"
              placeholder="Rick"
              type="name"
              autoCapitalize="true"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-black border text-white"
            />
          </div>
          <div className="grid gap-1">
            <div className="text-white text-sm mb-0">Last Name</div>
            <Label className="sr-only" htmlFor="lastname">
              Last Name
            </Label>
            <Input
              id="lastname"
              name="lastname"
              placeholder="Leinecker"
              type="name"
              autoCapitalize="true"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-black border text-white"
            />
          </div>
          <div className="grid gap-1">
            <div className="text-white text-sm mb-0">Email</div>
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="rick@leinecker.com"
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
            <div className="text-white text-sm mb-0">Password</div>
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isLoading}
              required
              className="bg-black border text-white"
            />
          </div>

          <div className="grid gap-1">
            <div className="text-white text-sm mb-0">Repeat your password</div>
            <Label className="sr-only" htmlFor="passwordrepeat">
              PasswordRepeat
            </Label>
            <Input
              id="passwordrepeat"
              placeholder="********"
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
            Sign Up
          </Button>
        </div>
      </form>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-transparent bars px-2 text-white text-muted-foreground">
          Or continue with
        </span>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
    </div>
  );
}
