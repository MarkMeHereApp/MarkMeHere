'use client';
import * as React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

import { AuthProviderCredentials } from '@prisma/client';

interface ProviderContextType {
  activeProviders: { providerKey: string; providerDisplayName: string }[];
  setActiveProviders: React.Dispatch<
    React.SetStateAction<{ providerKey: string; providerDisplayName: string }[]>
  >;
}

const ProviderContext = createContext<ProviderContextType>({
  activeProviders: [],
  setActiveProviders: () => {}
});

export default function ProviderContextProvider({
  children,
  initialActiveProviders
}: {
  children: React.ReactNode;
  initialActiveProviders: {
    providerKey: string;
    providerDisplayName: string;
  }[];
}) {
  const [activeProviders, setActiveProviders] = useState<
    { providerKey: string; providerDisplayName: string }[]
  >(initialActiveProviders || []);

  return (
    <ProviderContext.Provider
      value={{
        activeProviders,
        setActiveProviders
      }}
    >
      {children}
    </ProviderContext.Provider>
  );
}

export const useProviderContext = () => React.useContext(ProviderContext);
