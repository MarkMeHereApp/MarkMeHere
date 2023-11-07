'use client';

import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';

export function SuccessProviderContent() {
  const [isSigningOut, setSigningOut] = useState(false);
  const { organizationUrl } = useOrganizationContext();

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center">
            <ExclamationTriangleIcon className="text-primary mr-2 mt-1 w-6 h-6" />
            Please Test Your New Provider!
          </div>
        </DialogTitle>
        <DialogDescription>
          Although you successfully added the new provider, we recommend signing
          out and trying to log in with the new provider.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
          disabled={isSigningOut}
          onClick={() => {
            setSigningOut(true);
            signOut({ callbackUrl: `${organizationUrl}/admin-settings` });
          }}
        >
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </DialogFooter>
    </>
  );
}
