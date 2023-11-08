'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import { Icons } from '@/components/ui/icons';
import { ModeToggle } from '@/app/(dashboard)/[organizationCode]/components/theme-toggle';
import UserNav from './user-nav';
import isDevMode from '@/utils/isDevMode';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { NavItems: React.ReactNode[] }) {
  return (
    <div className="flex align-top items-center justify-end">
      <div className="flex pl-2">
        <nav className={cn('flex items-end space-x-4', className)} {...props}>
          <div className="hidden sm:flex space-x-4">
            {props.NavItems.map((NavItem, index) => NavItem)}
          </div>
        </nav>
      </div>
      <Icons.line
        className="ml-1 -mr-3"
        style={{ width: '50px', height: '50px' }}
      />
      <ModeToggle />
      <div className="pl-4 pr-8">
        <UserNav />
      </div>
    </div>
  );
}
