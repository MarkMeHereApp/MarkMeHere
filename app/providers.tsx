'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

type Props = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
  return (
    <>
      <Toaster />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};
