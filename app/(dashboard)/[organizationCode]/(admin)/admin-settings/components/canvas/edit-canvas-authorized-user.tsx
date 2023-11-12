'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { InputStringDialog } from '@/components/general/generic-input-string-dialog';
import { trpc } from '@/app/_trpc/client';
import { toastSuccess } from '@/utils/globalFunctions';
import { useState } from 'react';
import {
  addCanvasAuthorizedUserToOrganization,
  deleteCanvasAuthorizedUserFromOrganization
} from '@/data/organization/organization';
import { getEmailText } from '@/server/utils/userHelpers';

export const EditCanvasAuthorizedUser = ({
  configuredEmail,
  organizationCode
}: {
  configuredEmail: string | null;
  organizationCode: string;
}) => {
  const [email, setEmail] = useState(configuredEmail);
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    throw error;
  }

  const handleCreateKey = async (inputString: string) => {
    try {
      const newEmail = await addCanvasAuthorizedUserToOrganization({
        inputOrganizationCode: organizationCode,
        inputEmail: inputString
      });

      toastSuccess('Successfully added Canvas authorized user.');

      setEmail(newEmail);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCanvasAuthorizedUserFromOrganization(organizationCode);

      toastSuccess('Successfully removed Canvas authorized user.');

      setEmail(null);
      return;
    } catch (error) {
      setError(error as Error);
    }
  };

  const CreateDescription = () => (
    <div>
      Once you add the email, the user will be able to configure their Canvas
      API in their user settings.
    </div>
  );

  const DeleteDescription = () => (
    <div>
      Once you remove the email, the user will no longer be able to sync with
      Canvas.
    </div>
  );

  return (
    <>
      {email ? (
        <>
          <p className="text-sm text-muted-foreground">
            To sync with canvas, the authorized user must configure the Canvas
            API in their user settings.
          </p>

          <Alert>
            <div className="flex items-center justify-between ">
              <div className="flex items-center ">
                <CheckCircledIcon className="h-6 w-6 text-primary mr-2" />
                <b className="mr-2">{getEmailText(email)}</b> is authorized to
                use the Canvas Developer Key.
              </div>
              <AreYouSureDialog
                title="Are you sure you want to remove your Canvas authroized user?"
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
        <InputStringDialog
          title="Enter Canvas Authorized Email"
          onSubmit={handleCreateKey}
          DescriptionComponent={CreateDescription}
        >
          <Button variant={'outline'}>Add Authorized Email</Button>
        </InputStringDialog>
      )}
    </>
  );
};
