'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '@/app/course-context';

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { selectedCourseId } = useCourseContext();
  const pathname = usePathname(); // Use the hook

  // A helper function to determine if the link is active
  function isActive(href: string) {
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
      <MainNavBarCustomLink
        href="/dashboard/faculty/overview"
        displayText="Dashboard"
      />
      {selectedCourseId ? (
        <>
          <MainNavBarCustomLink
            href="/dashboard/faculty/take-attendance"
            displayText="Mark Attendance Status"
          />
          <MainNavBarCustomLink
            href="/dashboard/faculty/manage-course-members"
            displayText="Manage Course Members"
          />
        </>
      ) : null}
      <MainNavBarCustomLink
        href="/dashboard/faculty/testing-playground"
        displayText="Testing Playground"
      />
    </nav>
  );
}
