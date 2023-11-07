'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';
import { useProviderContext } from '@/app/context-auth-provider';
import ForwardButton from '@/components/steps/forward-button';
import { useUsersContext } from '../../../(admin)/context-users';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { SkeletonButtonText } from '@/components/skeleton/skeleton-button';

export const ConfigureAdminNextButton = ({
  currentStep
}: {
  currentStep: number;
}) => {
  const { userData } = useUsersContext();

  const hasAdminUser = () => {
    const admin = userData.users?.find(
      (user) => user.role === zSiteRoles.enum.admin
    );

    return !!admin;
  };

  return (
    <>
      {userData.users ? (
        <ForwardButton
          currentStep={currentStep}
          disabled={!hasAdminUser()}
          text={hasAdminUser() ? 'Next' : 'Add an Admin to your organization!'}
        />
      ) : (
        <SkeletonButtonText className="w-24" />
      )}
    </>
  );
};

export default ConfigureAdminNextButton;
