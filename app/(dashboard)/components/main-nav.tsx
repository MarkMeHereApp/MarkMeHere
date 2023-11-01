'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '@/app/context-course';
import isDevMode from '@/utils/isDevMode';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { selectedCourseId } = useCourseContext();
  const pathname = usePathname(); // Use the hook

  // A helper function to determine if the link is active
  function isActive(href: string) {
    // Since the Admin Dashboard has a bunch of pages inside of it, we have to be a big janky with it, and highlight the admin dashboard for all of its pages.
    if (href === '/manage-courses') {
      return (
        pathname === '/manage-courses' ||
        pathname === '/manage-site-users' ||
        pathname === '/admin-settings'
      );
    }
    return pathname === href;
  }

  const getLinkClassName = (path: string) => {
    const commonClasses = 'flex text-md font-medium pb-0';
    const activeLinkStyles = `${commonClasses} text-primary`;
    const inactiveLinkStyles = `${commonClasses} text-muted-foreground hover:text-primary`;
    return isActive(path) ? activeLinkStyles : inactiveLinkStyles;
  };

  const getBorderClassName = (path: string) => {
    const commonClasses = 'w-full p-3 pb-2 px-0';
    const activeBorderStyles = `${commonClasses} border-primary`;
    const inactiveBorderStyles = `${commonClasses} border-transparent hover:border-primary hover:border-solid`;
    return isActive(path) ? activeBorderStyles : inactiveBorderStyles;
  };

  type MainNavBarCustomLinkProps = {
    href: string;
    displayText: string;
  };

  const MainNavBarCustomLink: React.FC<MainNavBarCustomLinkProps> = ({
    href,
    displayText
  }) => (
    <Link href={href} className={getLinkClassName(href)}>
      <span className={getBorderClassName(href)}>{displayText}</span>
    </Link>
  );

  return (
    <nav className={cn('flex items-end space-x-4', className)} {...props}>
        <DropdownMenu>
            <DropdownMenuTrigger className='flex sm:hidden'>
              <HamburgerMenuIcon className='h-5 w-5'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <MainNavBarCustomLink 
                        href="/overview" 
                        displayText="Overview" 
                    />
                </DropdownMenuItem> 
                {selectedCourseId && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <MainNavBarCustomLink
                            href="/attendance"
                            displayText="Attendance"
                        />
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <MainNavBarCustomLink
                            href="/members"
                            displayText="Members"
                        />
                    </DropdownMenuItem>
                  </>
                 )
                }
            </DropdownMenuContent>
        </DropdownMenu>
      <div className='hidden sm:flex space-x-4'>
        <MainNavBarCustomLink href="/overview" displayText="Overview" />
        {selectedCourseId ? (
            <>
            <MainNavBarCustomLink
                href="/attendance"
                displayText="Attendance"
            />
            <MainNavBarCustomLink
                href="/members"
                displayText="Members"
            />
            </>
        ) : null}
        {isDevMode && (
            <MainNavBarCustomLink
                href="/testing-playground"
                displayText="Testing"
            />
        )
        }
      </div>
    </nav>
  );
}
