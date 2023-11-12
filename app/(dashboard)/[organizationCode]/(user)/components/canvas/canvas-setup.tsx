'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Alert } from '@/components/ui/alert';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { toastSuccess } from '@/utils/globalFunctions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { ConfigureCanvasUserDialog } from './canvas-submission-dialog';
import { Icons } from '@/components/ui/icons';
import { updateUserWithCanvasData } from '@/data/user/canvas';

export const CanvasSetup = ({
  canvasConfigured,
  organizationCode
}: {
  canvasConfigured: boolean;
  organizationCode: string;
}) => {
  const [configured, setConfigured] = useState(canvasConfigured);
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    throw error;
  }

  const handleDelete = async () => {
    try {
      await updateUserWithCanvasData({
        inputOrganizationCode: organizationCode,
        inputUrl: undefined,
        inputDevKey: undefined
      });
      toastSuccess('Successfully removed Canvas authorized user.');
      setConfigured(false);
      return;
    } catch (error) {
      setError(error as Error);
    }
  };

  const DeleteDescription = () => (
    <div>
      Once you remove the Canvas configuration, you will no longer be able to
      sync Canvas assignments. But you can always reconfigure it later!
    </div>
  );

  return (
    <>
      {configured ? (
        <>
          <p className="text-sm text-muted-foreground">
            Create a Canvas Course to start using sync features!
          </p>

          <Alert>
            <div className="flex items-center justify-between ">
              <div className="flex items-center ">
                <CheckCircledIcon className="h-6 w-6 text-primary mr-2" />
                <b className="mr-2">You Have Canvas Configured!</b>
              </div>
              <AreYouSureDialog
                title="Are you sure you want to remove your Canvas configuration?"
                AlertDescriptionComponent={DeleteDescription}
                onConfirm={handleDelete}
                bDestructive={true}
              >
                <Button variant="ghost">
                  <b className="text-destructive">Remove</b>
                </Button>
              </AreYouSureDialog>
            </div>
          </Alert>
        </>
      ) : (
        <ConfigureCanvasUserDialog
          onSubmit={() => {
            setConfigured(true);
          }}
          organizationCode={organizationCode}
        >
          <Button variant={'outline'}>
            {' '}
            <>
              <Icons.canvas className="h-6 w-6 text-destructive " />
              <span className="whitespace-nowrap ml-2  ">Configure Canvas</span>
            </>
          </Button>
        </ConfigureCanvasUserDialog>
      )}
    </>
  );
};
