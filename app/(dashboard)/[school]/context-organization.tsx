'use client';

import * as React from 'react';
import { useState } from 'react';

import { createContext } from 'react';
import { GlobalSiteSettings } from '@prisma/client';

type themeType = { light: string; dark: string };

interface OrganizationContextType {
  organization: GlobalSiteSettings | null;
  setOrganization: React.Dispatch<React.SetStateAction<GlobalSiteSettings>>;
  themes: themeType;
  setTheme: React.Dispatch<React.SetStateAction<themeType>>;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  setOrganization: () => {},
  themes: { light: 'light_neutral', dark: 'dark_neutral' },
  setTheme: () => {}
});

export default function OrganizationContextProvider({
  children,
  organization: initialOrganization,
  themes: initialThemes
}: {
  children?: React.ReactNode;
  organization: GlobalSiteSettings;
  themes: themeType;
}) {
  const [organization, setOrganization] = useState(initialOrganization);

  if (!organization) throw new Error('No organization found');

  const [themes, setTheme] = useState(initialThemes);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        setOrganization,
        themes,
        setTheme
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganizationContext = () =>
  React.useContext(OrganizationContext);
