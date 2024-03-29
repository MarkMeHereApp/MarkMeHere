'use client';

import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { trpc } from '@/app/_trpc/client';
import { toastSuccess, formatString } from '@/utils/globalFunctions';
import Loading from '@/components/general/loading';

export function WhoCanUseGoogleMaps({
  allowUsersGMaps
}: {
  allowUsersGMaps: boolean;
}) {
  const [selectedValue, setSelectedValue] = React.useState(() => {
    if (allowUsersGMaps) return 'everyone';
    return 'onlyAdmins';
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  if (error) throw error;
  const updateSiteSettings = trpc.organization.updateOrganization.useMutation();

  const handleSelectChange = async (value: string) => {
    setSelectedValue(value);
    try {
      setIsLoading(true);
      const allowUsersGMaps = value === 'everyone';

      const updatedSiteSettings = await updateSiteSettings.mutateAsync({
        allowUsersToUseGoogleMaps: allowUsersGMaps
      });
      toastSuccess(`Now ${formatString(value)} can use Google Maps!`);
      setIsLoading(false);
      return;
    } catch (error) {
      setError(error as Error);
    }
  };

  const SelectMode = ({ text }: { text: string }) => {
    return (
      <SelectItem value={text}>
        {isLoading ? <Loading name="Updating" /> : <>{formatString(text)}</>}
      </SelectItem>
    );
  };

  return (
    <div>
      <div className="text-sm text-muted-foreground pb-4">
        Who can use Google Maps? Please note that the Google Maps API costs
        money after a usage threshold, so you may incur charges.
      </div>
      <Select
        onValueChange={handleSelectChange}
        value={selectedValue}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectMode text="everyone" />
            <SelectMode text="onlyAdmins" />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
