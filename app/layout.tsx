import '@/styles/globals.css';
import '@/styles/styles.scss';

import { Suspense } from 'react';

import { Providers } from './providers';
import ProviderContextProvider from '@/app/context-auth-provider';

import { getServerSession } from 'next-auth/next';
import prisma from '@/prisma';

import { openSans } from '@/utils/fonts';

export const metadata = {
  title: 'Mark Me Here!',
  description:
    'Mark Me Here! is a robust web application that allows users take attendance in their classes and easily manage their attendance data.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession();
  const email = serverSession?.user?.email || '';

  const authProviders = await prisma.authProviderCredentials.findMany({
    select: {
      key: true,
      displayName: true,
      allowDangerousEmailAccountLinking: true
    }
  });
  const initialActiveProviders = authProviders.map((provider) => ({
    providerKey: provider.key,
    providerDisplayName: provider.displayName,
    accountLinkingEnabled: provider.allowDangerousEmailAccountLinking
  }));

  return (
    <html lang="en" className={openSans.className}>
      <body className="h-full" suppressHydrationWarning={true}>
        <Suspense fallback="...">{}</Suspense>
        <Providers>
          <ProviderContextProvider
            initialActiveProviders={initialActiveProviders}
          >
            {children}
          </ProviderContextProvider>
        </Providers>
      </body>
    </html>
  );
}
