'use client';

import * as React from 'react';
import { useState } from 'react';

import { createContext } from 'react';
import { GlobalSiteSettings } from '@prisma/client';

type themeType = { light: string; dark: string };

interface OrganizationContextType {
  organization: GlobalSiteSettings | null;
  setOrganization: React.Dispatch<React.SetStateAction<GlobalSiteSettings>>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  setOrganization: () => {}
});

export default function OrganizationContextProvider({
  children,
  organization: initialOrganization
}: {
  children?: React.ReactNode;
  organization: GlobalSiteSettings;
}) {
  const [organization, setOrganization] = useState(initialOrganization);

  if (!organization) throw new Error('No organization found');

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        setOrganization
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganizationContext = () =>
  React.useContext(OrganizationContext);
