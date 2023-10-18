'use client';

import { CheckCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { InputStringDialog } from '@/components/general/generic-input-string-dialog';
import { trpc } from '@/app/_trpc/client';
import { toastSuccess } from '@/utils/globalFunctions';
import { useState } from 'react';
import { WhoCanUseGoogleMaps } from './edit-who-can-use-googlemaps';

export const EditGoogleMapsKey = ({
  bHasConfigured,
  allowModeratorsGMaps,
  allowUsersGMaps
}: {
  bHasConfigured: boolean;
  allowModeratorsGMaps: boolean;
  allowUsersGMaps: boolean;
}) => {
  const [isConfigured, setIsConfigured] = useState(bHasConfigured);

  const updateSiteSettings = trpc.siteSettings.updateSiteSettings.useMutation();

  const handleCreateKey = async (inputString: string) => {
    try {
      const updatedSiteSettings = await updateSiteSettings.mutateAsync({
        googleMapsApiKey: inputString
      });
      toastSuccess('Successfully added your Google Maps API key!');
      setIsConfigured(true);
      return;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      const updatedSiteSettings = await updateSiteSettings.mutateAsync({
        googleMapsApiKey: ''
      });
      toastSuccess('Successfully deleted your Google Maps API key!');
      setIsConfigured(false);
      return;
    } catch (error) {
      throw error;
    }
  };

  const CreateDescription = () => (
    <div>
      You can create a Google Maps API key by following the instructions{' '}
      <b className="text-primary">
        <a
          href="https://developers.google.com/maps/documentation/javascript/get-api-key"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
      </b>
      .
    </div>
  );

  const DeleteDescription = () => (
    <div>
      By deleting your Google Maps API key, you will no longer be able to use
      the Google Maps visualization for Geolocation.
    </div>
  );

  return (
    <>
      {isConfigured ? (
        <>
          <p className="text-sm text-muted-foreground">
            If you want to change your Google Maps API Key, remove the current
            key, and add a new one.
          </p>

          <Alert>
            <div className="flex items-center justify-between ">
              <div className="flex items-center ">
                <CheckCircledIcon className="h-6 w-6 text-primary mr-2" />
                <b>Google Maps API Key is added</b>
              </div>
              <AreYouSureDialog
                title="Are you sure you want to Remove Your Google Maps API Key?"
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
          <WhoCanUseGoogleMaps
            allowModeratorsGMaps={allowModeratorsGMaps}
            allowUsersGMaps={allowUsersGMaps}
          />
        </>
      ) : (
        <InputStringDialog
          title="Enter your Google Maps API Key"
          onSubmit={handleCreateKey}
          DescriptionComponent={CreateDescription}
        >
          <Button variant={'outline'}>Add New Api Key</Button>
        </InputStringDialog>
      )}
    </>
  );
};
