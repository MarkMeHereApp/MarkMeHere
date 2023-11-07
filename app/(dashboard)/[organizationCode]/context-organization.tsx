'use client';

import * as React from 'react';
import { useState } from 'react';

import { createContext } from 'react';
import { Organization } from '@prisma/client';

type themeType = { light: string; dark: string };

interface OrganizationContextType {
  organization: Organization;
  setOrganization: React.Dispatch<React.SetStateAction<Organization>>;
  organizationUrl: string;
}

const defaultOrganization: Organization = {
  id: '',
  name: '',
  firstTimeSetupComplete: false,
  uniqueCode: '',
  lightTheme: '',
  darkTheme: '',
  hashEmails: false,
  googleMapsApiKey: null,
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
  organization: Organization;
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
