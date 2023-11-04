'use client';

import { Button } from '@/components/ui/button';
import { ContinueButton } from '@/components/general/continue-button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';

export const FinishSetupButton = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {loading ? (
        <Button disabled={true}>
          <Loading />
        </Button>
      ) : (
        <ContinueButton
          name="Sign In To Finish Setup"
          onClick={() => {
            setLoading(true);
            signOut();
          }}
        />
      )}
    </>
  );
};

export default FinishSetupButton;
