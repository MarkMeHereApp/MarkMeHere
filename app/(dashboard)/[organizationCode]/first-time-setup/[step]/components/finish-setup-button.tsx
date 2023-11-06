'use client';

import { Button } from '@/components/ui/button';
import { ContinueButton } from '@/components/general/continue-button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';
import { useProviderContext } from '@/app/context-auth-provider';

export const FinishFirstTimeSetup = () => {
  const { activeProviders } = useProviderContext();

  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <Button disabled={true}>
          <Loading />
        </Button>
      ) : (
        <ContinueButton
          name="Continue To App"
          disabled={activeProviders.length === 0}
          onClick={() => {
            setLoading(true);
            signOut();
          }}
        />
      )}
    </>
  );
};

export default FinishFirstTimeSetup;
