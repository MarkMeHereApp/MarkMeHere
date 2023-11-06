'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { PiUserCircleGear } from 'react-icons/pi';
import { signIn } from 'next-auth/react';

import { Alert, AlertDescription } from '@/components/ui/alert';

const FirstTimeLogin = (bHasProvidersSetup: { bHasProviderSetup: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  async function onSubmit() {
    try {
      setLoading(true);
      await signIn('credentials', {
        //This doesn't matter because it will allow us through if the organization hasn't been configured
        tempAdminKey: 'first-time-setup',
        callbackUrl: '/'
      });
    } catch (error) {
      setError(error as Error);
    }
  }

  return (
    <>
      <div className="pb-4">
        <Alert>
          <PiUserCircleGear className="w-5 h-5" />

          <AlertDescription className="text-left">
            {bHasProvidersSetup ? (
              <>
                Log to your configured sign-in method to finish the
                first-time-setup.{' '}
                <b>
                  If you are unsuccessfuly, you can enter the first-time setup
                  again by clicking "First Time Setup Login"
                </b>
              </>
            ) : (
              <>
                You need to configure the first time setup of the app to start
                using Mark Me Here! Log in to "First Time Setup Login" and make
                sure to add an admin account and sign in method.{' '}
                <b>
                  Once you've configured a new sign in method, log in with it to
                  finish setup.
                </b>
              </>
            )}
          </AlertDescription>
        </Alert>
      </div>

      <Button
        onClick={() => onSubmit()}
        disabled={loading}
        variant={bHasProvidersSetup ? 'outline' : 'default'}
      >
        <PiUserCircleGear className="mr-2 h-5 w-5" />
        First Time Setup Login
      </Button>
    </>
  );
};

export default FirstTimeLogin;
