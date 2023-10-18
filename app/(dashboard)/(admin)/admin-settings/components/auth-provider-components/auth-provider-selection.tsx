'use client';

import { CaretSortIcon } from '@radix-ui/react-icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProviderSubmissionDialog } from './auth-provider-popover/auth-provider-dialog';
import { useProviderContext } from '@/app/context-auth-provider';
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
import {
  providerFunctions,
  Provider
} from '@/app/api/auth/[...nextauth]/built-in-next-auth-providers';
import React, { useState, useEffect } from 'react';
import { ActiveAuthProvider } from './active-auth-providers/active-auth-provider';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';
import { InfoCircledIcon } from '@radix-ui/react-icons';

export default function AuthProviderSelector() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const [providerData, setProviderData] = useState<Provider | undefined>(
    undefined
  );

  const [showProviderSubmissionDialog, setShowProviderSubmissionDialog] =
    useState(false);

  const { activeProviders } = useProviderContext();

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
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search Provider..." />
            <CommandEmpty>No Auth Providers Found</CommandEmpty>
            <div className="overflow-y-auto max-h-[300px]">
              <CommandGroup>
                {Object.values(providerFunctions).map((provider) => {
                  const isActiveProvider = activeProviders
                    .map((ap) => ap.providerKey)
                    .includes(provider.key);
                  return (
                    <CommandItem
                      value={provider.defaultDisplayName}
                      key={provider.key}
                      onSelect={() => setSelectedProvider(provider.key)}
                      disabled={isActiveProvider}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`${isActiveProvider ? 'opacity-20' : ''}`}
                        >
                          {provider.defaultDisplayName}
                        </span>
                        <div className="ml-2">
                          {provider.CustomMessage && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <span
                                  className={`${
                                    isActiveProvider ? 'opacity-20' : ''
                                  }`}
                                >
                                  <InfoCircledIcon />
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-96" side="right">
                                <provider.CustomMessage />
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      <>
        {activeProviders.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              Iif you want to change the keys of a provider, please remove the
              provider and add it again.
            </p>
            {activeProviders.map((provider) => {
              const providerFunction = Object.values(providerFunctions).find(
                (pf) => pf.key === provider.providerKey
              );
              const defaultDisplayName = providerFunction
                ? providerFunction.defaultDisplayName
                : provider.providerDisplayName;
              return (
                <ActiveAuthProvider
                  providerKey={provider.providerKey}
                  displayName={provider.providerDisplayName}
                  accountLinkingEnabled={provider.accountLinkingEnabled}
                  defaultDisplayName={defaultDisplayName}
                />
              );
            })}
          </>
        )}
      </>
    </>
  );
}
