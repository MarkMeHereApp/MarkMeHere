'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';
import { useProviderContext } from '@/app/context-auth-provider';

export const LogOutSetupButton = (props: {
  text: string;
  organizationCode: string;
  currentStep: number;
}) => {
  const { activeProviders } = useProviderContext();

  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button
        disabled={activeProviders.length === 0}
        onClick={() => {
          setLoading(true);
          signOut({
            callbackUrl: `/${props.organizationCode}/first-time-setup/${(
              props.currentStep + 1
            ).toString()}`
          });
        }}
      >
        {loading ? <Loading /> : props.text}
      </Button>
    </>
  );
};

export default LogOutSetupButton;
