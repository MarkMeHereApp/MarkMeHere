import { Suspense } from 'react';
import prisma from '@/prisma';

import ProviderContextProvider from './provider-context';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  /*
    @TODO we need to make sure your an admin here...
  */

  const authProviders = await prisma.authProviderCredentials.findMany({});
  const initialActiveProviders = authProviders.map((provider) => ({
    providerKey: provider.key,
    providerDisplayName: provider.displayName
  }));

  return (
    <ProviderContextProvider initialActiveProviders={initialActiveProviders}>
      {children}
    </ProviderContextProvider>
  );
}
