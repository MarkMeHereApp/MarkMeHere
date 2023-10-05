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
  const providerDisplayNames = authProviders.map(
    (provider) => provider.displayName
  );

  return (
    <ProviderContextProvider initialActiveProviders={providerDisplayNames}>
      {children}
    </ProviderContextProvider>
  );
}
