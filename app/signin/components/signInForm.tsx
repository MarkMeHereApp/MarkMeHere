'use client';

import * as React from 'react';

import { ModeToggle } from '@/components/theme/theme-toggle';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import dynamic from 'next/dynamic';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { firaSansFont } from '@/utils/fonts';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import GitHubEduError from './info/github-edu-error';
import GitHubEduMessage from './info/github-edu-info';
import DemoModeInfo from './info/demo-mode-info';
import TempAdminInfo from './info/temp-admin-info';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import Loading from '@/components/general/loading';
import GenerateTemporaryAdmin from './generate-temporary-admin';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { demoAccounts } from '@/utils/globalVariables';

type TProvider = {
  key: string;
  displayName: string;
};

interface SignInFormProps {
  providers: Array<TProvider>;
  bHasTempAdminConfigured?: boolean;
  bIsDemoMode?: boolean;
  lightTheme: string;
  darkTheme: string;
}

export default function SignInForm({
  providers,
  bHasTempAdminConfigured,
  bIsDemoMode,
  lightTheme,
  darkTheme
}: SignInFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = React.useState<{ [key: string]: boolean }>(
    {}
  );
  const { data: session } = useSession();
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorState, setErrorState] = React.useState<Error | null>(null);

  if (errorState) {
    throw errorState;
  }

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

      case 'username':
        error = 'Username not found';
        break;

      case 'OAuthSignin':
        error = 'OAuth Sign In Error.';
        break;

      case 'OAuthAccountNotLinked':
        error =
          'There is already an account with that username address and the provider you just tried to sign-in with has Account Linking disabled. ';
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
        username,
        password,
        callbackUrl: callbackUrl
      });
    } catch (error) {
      setErrorState(error as Error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, credentials: false })); // Set loading to false at the end of the function
    }
  };

  const onDemoSubmit = async ({ name }: { name: string }) => {
    setIsLoading((prevState) => ({ ...prevState, demo: true })); // Set loading to true at the start of the function
    try {
      await signIn('credentials', {
        username: name,
        password: name,
        demoLogin: true,
        callbackUrl: callbackUrl
      });
    } catch (error) {
      setErrorState(error as Error);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, demo: false })); // Set loading to false at the end of the function
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
      setErrorState(error as Error);
    }
  };

  const OAuthButton = ({
    provider,
    onSubmit
  }: {
    provider: TProvider;
    onSubmit?: (key: string) => Promise<void>;
  }) => (
    <Button
      type="button"
      onClick={() => onSubmit && onSubmit(provider.key)}
      disabled={Object.values(isLoading).some((value) => value)}
    >
      {isLoading[provider.key] ? (
        <>
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        <>{provider.displayName}</>
      )}
    </Button>
  );

  return (
    <div className="relative h-screen">
      <div className="absolute top-0 right-0 h-full w-full">
        <Stars />
      </div>

      <Card className="w-full sm:w-[500px] max-h-full overflow-y-auto mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 ">
        <CardContent className="flex flex-col w-full">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold font-mono">
              <span className={firaSansFont.className}>
                Sign in to Mark Me Here!
              </span>
            </CardTitle>
            <ModeToggle lightTheme={lightTheme} darkTheme={darkTheme} />
          </div>

          <div className="flex flex-col gap-4">
            <Alert className="text-center text-red-500 border-0">
              {error && (
                <AlertDescription>Log In Error: {error}</AlertDescription>
              )}
            </Alert>

            {bIsDemoMode && (
              <>
                <DemoModeInfo />
                <Select
                  onValueChange={(value) => onDemoSubmit({ name: value })}
                  disabled={Object.values(isLoading).some((value) => value)}
                >
                  <SelectTrigger className="w-full">
                    {isLoading.demo ? (
                      <Loading name="Logging In" />
                    ) : (
                      <SelectValue placeholder="Select a Demo Account" />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/*<SelectLabel>Admin</SelectLabel>*/}
                      {demoAccounts.map((account) => (
                        <SelectItem key={account.name} value={account.name}>
                          {`${account.name}@demo.com`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}

            {bHasTempAdminConfigured && (
              <>
                <TempAdminInfo /> <GenerateTemporaryAdmin />
              </>
            )}

            <GitHubEduError providers={providers} errorType={errorType} />

            {providers &&
              Object.values(providers).some(
                (provider) => provider.key === 'credentials'
              ) && (
                <form onSubmit={onCredentialsSubmit}>
                  <div className="gap-2 space-y-5">
                    <CardTitle className="text-center text-sm text-muted-foreground">
                      Enter your username & password below to login
                    </CardTitle>

                    <div className="flex flex-col gap-1">
                      <div className="text-sm font-bold mb-0">Username</div>

                      <Label className="sr-only" htmlFor="username">
                        Username
                      </Label>

                      <Input
                        id="username"
                        name="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="test@test is a valid username"
                        type="username"
                        autoCapitalize="none"
                        autoComplete="username"
                        autoCorrect="off"
                        disabled={isLoading.credentials}
                        required
                        className="border flex"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
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
                        className="border flex"
                      />
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
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
                (provider) => provider.key === 'credentials'
              ) && (
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent bars px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              )}

            {providers &&
              Object.values(providers)
                .sort((a, b) =>
                  a.key === 'githubedu' ? -1 : b.key === 'githubedu' ? 1 : 0
                )
                .map((provider, index) => {
                  if (
                    provider.key !== 'credentials' &&
                    provider.key !== 'githubedu'
                  ) {
                    return (
                      <OAuthButton
                        key={index}
                        provider={provider}
                        onSubmit={onOAuthSubmit}
                      />
                    );
                  } else if (provider.key === 'githubedu') {
                    return (
                      <AreYouSureDialog
                        key={index}
                        buttonText={`Continue with ${provider.displayName}`}
                        onConfirm={() => {
                          return onOAuthSubmit(provider.key);
                        }}
                        AlertDescriptionComponent={() => (
                          <GitHubEduMessage providers={providers} />
                        )}
                      >
                        <Button
                          type="button"
                          className="w-full"
                          disabled={Object.values(isLoading).some(
                            (value) => value
                          )}
                        >
                          {provider.displayName}
                        </Button>
                      </AreYouSureDialog>
                    );
                  }
                })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
