'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/general/loading';

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Button
        variant={'outline'}
        onClick={() => {
          setLoading(true);
          signOut({
            callbackUrl: `/`
          });
        }}
      >
        {loading ? <Loading /> : 'Sign Out'}
      </Button>
    </>
  );
};

export default SignOutButton;
