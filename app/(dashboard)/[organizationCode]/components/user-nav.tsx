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
import { GearIcon } from '@radix-ui/react-icons';

/*
 * @TODO - This should be a server component
 * Currently Next.js does not support async server components
 * ( which is needed to access the serverSession) But they will soon
 */

export default function UserNav() {
  const { organization } = useOrganizationContext();
  const session = useSession();
  const name = session?.data?.user?.name || '';
  const userEmail = session?.data?.user?.email || '';
  const avatar = session?.data?.user?.image || undefined;

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
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem></DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-between">
          <Link href={`/${organization.uniqueCode}/user-settings`}>
            Settings
          </Link>
          <GearIcon />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
