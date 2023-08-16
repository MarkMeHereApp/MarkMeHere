'use client'

import Link from "next/link";
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();  // Use the hook

  // A helper function to determine if the link is active
  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link 
          href="/"
          className={isActive("/") ? "text-sm font-medium text-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}
        >
        Dashboard
      </Link>
      <Link
        href="/class-settings"
        className={isActive("/class-settings") ? "text-sm font-medium text-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}
        >
        Settings
      </Link>
      <Link
        href="/signin"
        className={isActive("/signin") ? "text-sm font-medium text-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}
        >
        temp sign in
      </Link>
      <Link
        href="/signup"
        className={isActive("/signup") ? "text-sm font-medium text-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}
        >
        temp sign up
      </Link>

      <a
      href="https://cdn.discordapp.com/attachments/1078896207486787584/1078896797512122452/boom.gif"
      className={isActive("/asdasd") ? "text-sm font-medium text-primary" : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"}
      target="_blank" rel="noopener noreferrer"
      >
      I dare you to click this button
      </a>
  
    </nav>
  )
}