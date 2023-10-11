'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '@/app/context-course';

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
    const commonClasses = 'flex text-md font-mediu n pb-0';
    const activeLinkStyles = `${commonClasses} text-primary`;
    const inactiveLinkStyles = `${commonClasses} text-muted-foreground hover:text-primary`;
    return isActive(path) ? activeLinkStyles : inactiveLinkStyles;
  };

  const getBorderClassName = (path: string) => {
    const commonClasses = 'border-b-2 w-full p-3 pb-2 px-0';
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
      <MainNavBarCustomLink href="/overview" displayText="Overview" />
      {selectedCourseId ? (
        <>
          <MainNavBarCustomLink
            href="/mark-attendance-status"
            displayText="Mark Attendance Status"
          />
          <MainNavBarCustomLink
            href="/manage-course-members"
            displayText="Course Members"
          />
          <MainNavBarCustomLink
                href="/student"
                displayText="Student Dashboard"
              />
          {/* {selectedCourseRole == 'student' ? (
              <MainNavBarCustomLink
                href="/student"
                displayText="Student Dashboard"
              />
            ) : (
                null
            )
          } */}
        </>
      ) : null}

      <MainNavBarCustomLink
        href="/manage-courses"
        displayText="Admin Dashboard"
      />

      <MainNavBarCustomLink
        href="/testing-playground"
        displayText="Testing Playground"
      />
    </nav>
  );
}
