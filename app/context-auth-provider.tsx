'use client';
import * as React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

type ActiveProvider = {
  providerKey: string;
  providerDisplayName: string;
  accountLinkingEnabled: boolean;
};

interface ProviderContextType {
  activeProviders: ActiveProvider[];
  setActiveProviders: React.Dispatch<React.SetStateAction<ActiveProvider[]>>;
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
  initialActiveProviders: ActiveProvider[];
}) {
  const [activeProviders, setActiveProviders] = useState<ActiveProvider[]>(
    initialActiveProviders || []
  );

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
