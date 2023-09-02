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
        href="/dashboard/overview"
        className={
          isActive('/dashboard/overview')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Dashboard
      </Link>
      <Link
        href="/dashboard/take-attendance"
        className={
          isActive('/dashboard/take-attendance')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Attendance Management
      </Link>
      <Link
        href="/dashboard/manage-students"
        className={
          isActive('/dashboard/manage-students')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Manage Students
      </Link>
      <Link
        href="/dashboard/student-statistics"
        className={
          isActive('/dashboard/student-statistics')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Student Statistics
      </Link>
      <Link
        href="/dashboard/class-settings"
        className={
          isActive('/dashboard/class-settings')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        Class Settings
      </Link>
      <Link
        href="/api/auth/signin"
        className={
          isActive('/api/auth/signin')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        temp sign in
      </Link>
      <Link
        href="/api/auth/signup"
        className={
          isActive('/api/auth/signup')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        temp sign up
      </Link>

      <Link
        href="/scan/qr"
        className={
          isActive('/gather-attendance/qr')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        QR Attendance
      </Link>

      <button
        onClick={() => {
          signOut({ callbackUrl: '/api/auth/signin' });
        }}
        className={
          isActive('/signup')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
      >
        temp sign out
      </button>

      <a
        href="https://cdn.discordapp.com/attachments/1078896207486787584/1078896797512122452/boom.gif"
        className={
          isActive('/asdasd')
            ? 'text-sm font-medium text-primary'
            : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        I dare you to click this button
      </a>
    </nav>
  );
}
