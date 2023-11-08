'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import Loading from '@/components/general/loading';
import { formatString } from '@/utils/globalFunctions';

export function MobileNav({ NavItems }: { NavItems: React.ReactNode[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { organizationUrl } = useOrganizationContext();
  const [signingOut, setSigningOut] = useState(false);
  const session = useSession();
  const name = session?.data?.user?.name || '';
  const userEmail = session?.data?.user?.email || '';
  const avatar = session?.data?.user?.image || undefined;
  const role = session?.data?.user?.role;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="pr-6">
          <Button variant="ghost" size={'icon'} className="w-8 h-8">
            <HamburgerMenuIcon className="w-6 h-6" />
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="pb-6">
          <SheetTitle className="flex justify-between items-center pr-6">
            <span className="overflow-hidden text-overflow[ellipsis] whitespace-nowrap">
              {name}
            </span>
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} />
              <AvatarFallback>{name.charAt(0) || ''}</AvatarFallback>
            </Avatar>
          </SheetTitle>
          <SheetDescription className="text-left  overflow-hidden text-overflow[ellipsis] whitespace-nowrap">
            {userEmail}

            <div className="pt-2">{formatString(role || '')}</div>
          </SheetDescription>
        </SheetHeader>
        <div
          className="pt-4 pb-4 scrollable-content"
          style={{
            maxHeight: 'calc(100vh - 6rem)',
            overflowY: 'auto',
            paddingRight: '15px',
            boxSizing: 'content-box',
            width: 'calc(100% - 15px)'
          }}
        >
          {NavItems.map((NavItem, index) => NavItem)}
          <div className="pt-6">
            <div className="pb-6">
              <Link href={`${organizationUrl}/user-settings`}>
                <Button className="justify-between w-full" variant={'ghost'}>
                  Settings
                  <GearIcon />
                </Button>
              </Link>

              {role === zSiteRoles.enum.admin && (
                <div className="pt-4">
                  <Link href={`${organizationUrl}/admin-settings`}>
                    <Button
                      className="justify-between w-full"
                      variant={'ghost'}
                    >
                      Admin Panel <PiUserCircleGear />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            <div className="pb-6">
              <DropdownMenuSeparator />
            </div>
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
