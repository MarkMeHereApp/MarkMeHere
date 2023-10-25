'use client';

import * as React from 'react';
import { useState } from 'react';

import { createContext } from 'react';
import { GlobalSiteSettings } from '@prisma/client';

type themeType = { light: string; dark: string };

interface OrganizationContextType {
  organization: GlobalSiteSettings;
  setOrganization: React.Dispatch<React.SetStateAction<GlobalSiteSettings>>;
  organizationUrl: string;
}

const defaultOrganization: GlobalSiteSettings = {
  id: '',
  name: '',
  uniqueCode: '',
  lightTheme: '',
  darkTheme: '',
  googleMapsApiKey: null,
  allowModeratorsToUseGoogleMaps: false,
  allowUsersToUseGoogleMaps: false
};

const OrganizationContext = createContext<OrganizationContextType>({
  organization: defaultOrganization,
  setOrganization: () => {},
  organizationUrl: ''
});

export default function OrganizationContextProvider({
  children,
  organization: initialOrganization
}: {
  children?: React.ReactNode;
  organization: GlobalSiteSettings;
}) {
  const [organization, setOrganization] = useState(initialOrganization);
  const [organizationUrl] = useState(`/${organization.uniqueCode}`);

  if (!organization || organization.id === '') {
    throw new Error('No organization found');
  }

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        setOrganization,
        organizationUrl
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export const useOrganizationContext = () =>
  React.useContext(OrganizationContext);
