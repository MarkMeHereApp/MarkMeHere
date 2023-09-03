'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import TRPC_Provider from './_trpc/TRPC_Provider';

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <>
      <TRPC_Provider>
        <Toaster />
        <SessionProvider>{children}</SessionProvider>
      </TRPC_Provider>
    </>
  );
};

export default Providers;
