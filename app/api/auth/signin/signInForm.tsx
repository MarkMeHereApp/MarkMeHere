'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSession, signIn} from "next-auth/react"

import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// These are weird imports but it's how we can pass the getProviders type to the SignInForm component
import { BuiltInProviderType } from 'next-auth/providers'
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react';
import Github from 'next-auth/providers/github';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null;
}

export default function SignInForm({ className, providers, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<{[key: string]: boolean}>({});
  const {data: session} = useSession()
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

      case 'Callback':
        error = 'OAuth Redirect Error Mismatch.'
        break;
        
      default:
        error = 'Unknown Error';
    }
  }

  useEffect(() => {
    if (session && router) {
      router.push('/dashboard');
    }
  }, [session, router]);
  

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(prevState => ({...prevState, credentials: true})); // Set loading to true at the start of the function
  try {
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',

    });
  } catch (error) {
    console.error('Unexpected Error: ', error);
  } finally {
    setIsLoading(prevState => ({...prevState, credentials: false})); // Set loading to false at the end of the function
  }
};

  return (
    <div className={cn('grid gap-4', className)} {...props}>
      { providers && Object.values(providers).some(provider => provider.type === 'credentials') && (
          <form onSubmit={onSubmit}>
            <div className="grid gap-2">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Enter your email & password below to login
                </p>
              </div>
              {error && (
                <Alert className="text-center text-red-500">
                  <AlertDescription>
                  Log In Error: {error}
                  </AlertDescription>
                </Alert>
              )}
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
              <div className="grid gap-1 mt-1"> {/* Added a margin-top class to create a bigger gap */}
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
        )
      }
      
      { providers && Object.values(providers).length > 1  && Object.values(providers).some(provider => provider.type === 'credentials') && (
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent bars px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      )}

      
      { providers && Object.values(providers).map((provider, index) => (
          provider.type !== 'credentials' && (
            <Button 
              key={index}
              type="button" 
              onClick={async () => {
                setIsLoading(prevState => ({...prevState, [provider.id]: true}));
                try {
                  await signIn(provider.id, { callbackUrl: '/dashboard' });
                } catch (error) {
                  console.error('Sign In Error: ', error);
                } finally {
                  setIsLoading(prevState => ({...prevState, [provider.id]: false}));
                }
              }} 
              disabled={isLoading[provider.id]}
            >
              {isLoading[provider.id] ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  {provider.name}
                </>

              )}
            </Button>
          )
      ))}
    </div>
  );
}
