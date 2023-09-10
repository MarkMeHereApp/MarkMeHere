'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Import the useRouter hook

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname(); // Use the hook

  // A helper function to determine if the link is active
  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="/dashboard/faculty/overview"
        className={
          isActive('/dashboard/faculty/overview')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/faculty/take-attendance"
        className={
          isActive('/dashboard/faculty/take-attendance')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Attendance Management
      </Link>
      <Link
        href="/dashboard/faculty/manage-course-members"
        className={
          isActive('/dashboard/faculty/manage-course-members')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Manage Course Members
      </Link>
      {/* <Link
        href="/dashboard/student-statistics"
        className={
          isActive('/dashboard/student-statistics')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Student Statistics
      </Link> */}
      <Link
        href="/dashboard/faculty/testing-playground"
        className={
          isActive('/dashboard/faculty/tests')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Testing Playground
      </Link>
    </nav>
  );
}
