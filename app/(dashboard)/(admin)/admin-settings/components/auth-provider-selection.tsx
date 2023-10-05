'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';

import { ProviderSubmissionDialog } from './auth-provider-popover/auth-provider-dialog';
import { useProviderContext } from '../provider-context';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { providerFunctions } from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import React, { useState, useEffect } from 'react';

import { ActiveAuthProvider } from './active-auth-providers/active-auth-provider';

export default function AuthProviderSelector() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  type ProviderData =
    (typeof providerFunctions)[keyof typeof providerFunctions];

  const [providerData, setProviderData] = useState<ProviderData | undefined>(
    undefined
  );

  const [showProviderSubmissionDialog, setShowProviderSubmissionDialog] =
    useState(false);

  const { activeProviders, setActiveProviders } = useProviderContext();

  useEffect(() => {
    if (selectedProvider) {
      const foundProvider = Object.values(providerFunctions).find(
        (p) => p.key === selectedProvider
      );
      setProviderData(foundProvider);
      setShowProviderSubmissionDialog(true);
      setSelectedProvider(null);
    }
  }, [selectedProvider]);

  return (
    <>
      <ProviderSubmissionDialog
        isDisplaying={showProviderSubmissionDialog}
        setIsDisplaying={setShowProviderSubmissionDialog}
        data={providerData}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" className="justify-between">
            Add New Auth Provider
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Provider..." />
            <CommandEmpty>No Auth Providers Found</CommandEmpty>
            <CommandGroup>
              {Object.values(providerFunctions)
                .filter(
                  (provider) => !activeProviders.includes(provider.displayName)
                )
                .map((provider) => (
                  <CommandItem
                    value={provider.displayName}
                    key={provider.key}
                    onSelect={() => setSelectedProvider(provider.key)}
                  >
                    {provider.displayName}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {Object.values(providerFunctions)
        .filter((provider) => activeProviders.includes(provider.displayName))
        .map((provider) => (
          <ActiveAuthProvider displayName={provider.displayName} className="" />
        ))}
    </>
  );
}
