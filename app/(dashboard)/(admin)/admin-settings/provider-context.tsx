'use client';
import * as React from 'react';
import { useState } from 'react';
import { createContext } from 'react';

import { AuthProviderCredentials } from '@prisma/client';

interface ProviderContextType {
  activeProviders: string[];
  setActiveProviders: React.Dispatch<React.SetStateAction<string[]>>;
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
  initialActiveProviders: string[];
}) {
  const [activeProviders, setActiveProviders] = useState<string[]>(
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
