'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { ConfirmDeleteDialog } from '@/components/general/are-you-sure-alert-dialog';
import { toastSuccess } from '@/utils/globalFunctions';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { useProviderContext } from '../../provider-context';
import { AccountLinkingInfoHover } from '../account-linking-info';
export const ActiveAuthProvider = ({
  providerKey,
  displayName,
  defaultDisplayName,
  accountLinkingEnabled
}: {
  providerKey: string;
  displayName: string;
  defaultDisplayName: string;
  accountLinkingEnabled: boolean;
}) => {
  const deleteAuthProviderMutation =
    trpc.provider.deleteActiveProvider.useMutation();

  const [error, setError] = useState<Error | null>(null);
  const { setActiveProviders } = useProviderContext();

  if (error) {
    throw error;
  }

  const handleDelete = async () => {
    try {
      await deleteAuthProviderMutation.mutateAsync({ displayName });
      toastSuccess('Successfully Deleted Auth Provider!');
      setActiveProviders((prev) =>
        prev.filter((provider) => provider.providerKey !== providerKey)
      );
      return;
    } catch (error) {
      setError(error as Error);
      return;
    }
  };

  return (
    <Alert>
      <div className="flex items-center justify-between ">
        <div className="flex items-center ">
          <CheckCircledIcon className="h-6 w-6 text-primary mr-2" />
          <b className="mr-2">{displayName}</b>{' '}
          {defaultDisplayName !== displayName && (
            <i className="mr-2">{`(${defaultDisplayName})`}</i>
          )}
          <span className="overflow-ellipsis overflow-hidden">
            Configured <b>{accountLinkingEnabled ? 'With' : 'Without'}</b>{' '}
            Account Linking
          </span>
          <div className="ml-1">
            <AccountLinkingInfoHover />
          </div>
        </div>
        <ConfirmDeleteDialog
          title="Are you sure you want to delete the GitHub OAuth provider?"
          description={`This action will remove ${displayName} from your active providers list. However, you can re-add the ${displayName} provider at any time in the future. Importantly, no user data 
          will be deleted during this process. Users who have previously signed in using this provider can still sign in using their existing email address with another OAuth account, 
          as long as that OAuth provider has 'Account Linking' enabled`}
          onConfirm={handleDelete}
        >
          <Button variant="ghost">
            <b className="text-destructive">Remove</b>
          </Button>
        </ConfirmDeleteDialog>
      </div>
    </Alert>
  );
};
