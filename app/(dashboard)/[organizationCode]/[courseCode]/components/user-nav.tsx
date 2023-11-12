'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import { signOut } from 'next-auth/react';
import { GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { PiUserCircleGear } from 'react-icons/pi';
import { useState } from 'react';
import Loading from '@/components/general/loading';
import { formatString } from '@/utils/globalFunctions';
import { getEmailText } from '@/server/utils/userHelpers';

/*
 * @TODO - This should be a server component
 * Currently Next.js does not support async server components
 * ( which is needed to access the serverSession) But they will soon
 */

export default function UserNav() {
  const { organizationUrl } = useOrganizationContext();
  const [signingOut, setSigningOut] = useState(false);
  const session = useSession();
  const name = session?.data?.user?.name || '';
  const userEmail = session?.data?.user?.email || '';
  const avatar = session?.data?.user?.image || undefined;
  const role = session?.data?.user?.role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatar} />
            <AvatarFallback>{name.charAt(0) || ''}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs leading-none text-muted-foreground pt-1">
              {getEmailText(userEmail)}
              <div className="pt-2">{formatString(role || '')}</div>
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href={`${organizationUrl}/user-settings`}>
          <Button className="justify-between w-full" variant={'ghost'}>
            Settings
            <GearIcon />
          </Button>
        </Link>

        {role === zSiteRoles.enum.admin && (
          <Link href={`${organizationUrl}/admin-settings`}>
            <Button className="justify-between w-full" variant={'ghost'}>
              Admin Panel <PiUserCircleGear />
            </Button>
          </Link>
        )}
        <DropdownMenuSeparator />
        <Button
          className="justify-between w-full"
          variant={'ghost'}
          disabled={signingOut}
          onClick={() => {
            setSigningOut(true);
            signOut({ callbackUrl: `/` });
          }}
        >
          {signingOut ? <Loading name="Signing Out" /> : 'Sign Out'}
          <ExitIcon />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
