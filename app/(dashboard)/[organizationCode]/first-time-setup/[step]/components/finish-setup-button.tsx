'use client';

import { Button } from '@/components/ui/button';
import { ContinueButton } from '@/components/general/continue-button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';
import { useProviderContext } from '@/app/context-auth-provider';
import { trpc } from '@/app/_trpc/client';
import { redirect } from 'next/navigation';

export const FinishFirstTimeSetup = ({
  organizationCode
}: {
  organizationCode: string;
}) => {
  const { activeProviders } = useProviderContext();

  const finishSetupMutation =
    trpc.organization.finishOrganizationSetup.useMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    throw error;
  }

  const FinishSetup = async () => {
    setLoading(true);
    try {
      await finishSetupMutation.mutateAsync({
        uniqueCode: organizationCode
      });
      redirect(`/${organizationCode}/create-first-course`);
    } catch (error) {
      setError(error as Error);
    }
  };
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
            FinishSetup();
          }}
        />
      )}
    </>
  );
};

export default FinishFirstTimeSetup;
