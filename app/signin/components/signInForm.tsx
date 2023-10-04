'use client';

import * as React from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic';

import { Card, CardContent } from '@/components/ui/card';
import { firaSansFont } from '@/utils/fonts';

// These are weird imports but it's how we can pass the getProviders type to the SignInForm component
import { BuiltInProviderType } from 'next-auth/providers';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

export default function SignInForm({
  className,
  providers,
  ...props
}: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<{ [key: string]: boolean }>(
    {}
  );
  const { data: session } = useSession();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const callbackUrl = searchParams
    ? searchParams.get('callbackUrl') || '/'
    : '/';

  const errorType = searchParams ? searchParams.get('error') : null;
  let error: string | null = null;
  if (errorType) {
    switch (errorType) {
      case 'CredentialsSignin':
        error = 'Invalid credentials';
        break;

      case 'Callback':
        error = 'OAuth Redirect Error Mismatch.';
        break;

      case 'OAuthCallback':
        error = `Third-Party Callback Error.`;
        break;

      case 'email':
        error = 'Email not found';
        break;

      case 'OAuthSignin':
        error = 'OAuth Sign In Error.';
        break;

      default:
        error = 'Unknown Error';
    }
  }

  useEffect(() => {
    if (error) {
      toast({
        title: `Error Logging In`,
        description: error,
        icon: 'error_for_destructive_toasts',
        variant: 'destructive'
      });
    }
  }, [error]);

  const Stars = dynamic(() => import('@/components/background/stars'), {
    ssr: false
  });

  useEffect(() => {
    if (session && router) {
      router.push('/overview');
    }
  }, [session, router]);

  const onCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading((prevState) => ({ ...prevState, credentials: true })); // Set loading to true at the start of the function
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: callbackUrl
      });
    } catch (error) {
      console.error('Unexpected Error: ', error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, credentials: false })); // Set loading to false at the end of the function
    }
  };

  const onOAuthSubmit = async (providerId: string) => {
    setIsLoading((prevState) => ({
      ...prevState,
      [providerId]: true
    }));
    try {
      await signIn(providerId, {
        callbackUrl: callbackUrl
      });
      setIsLoading((prevState) => ({
        ...prevState,
        [providerId]: false
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={cn('relative h-screen', className)} {...props}>
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars />
      </div>
      <Card className="w-[400px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
        <CardContent>
          <div className="flex flex-col space-y-2 text-center p-3 pb-6">
            <span className={firaSansFont.className}>
              <h1 className={`text-2xl font-bold`}>Sign in Mark Me Here!</h1>
            </span>
          </div>
          <div className="grid gap-4">
            {error && (
              <Alert className="text-center text-red-500">
                <AlertDescription>Log In Error: {error}</AlertDescription>
              </Alert>
            )}

            {providers &&
              Object.values(providers).some(
                (provider) => provider.type === 'credentials'
              ) && (
                <form onSubmit={onCredentialsSubmit}>
                  <div className="grid gap-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Enter your email & password below to login
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <div className="text-sm font-bold mb-0">Email</div>
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
                        className="border"
                      />
                    </div>
                    <div className="grid gap-1">
                      <div className="text-sm font-bold mb-0">Password</div>
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
                        className="border"
                      />
                    </div>
                    <div className="grid gap-1 mt-1">
                      {' '}
                      {/* Added a margin-top class to create a bigger gap */}
                      <Button
                        disabled={isLoading.credentials}
                        variant="outline"
                      >
                        {isLoading.credentials && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                      </Button>
                    </div>
                  </div>
                </form>
              )}

            {providers &&
              Object.values(providers).length > 1 &&
              Object.values(providers).some(
                (provider) => provider.type === 'credentials'
              ) && (
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent bars px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              )}

            {providers &&
              Object.values(providers).map(
                (provider, index) =>
                  provider.type !== 'credentials' && (
                    <Button
                      key={index}
                      type="button"
                      onClick={() => onOAuthSubmit(provider.id)}
                      disabled={isLoading[provider.id]}
                    >
                      {isLoading[provider.id] ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>{provider.name}</>
                      )}
                    </Button>
                  )
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
