import '@/styles/globals.css';
import '@/styles/styles.scss';

import AnalyticsWrapper from './analytics';
import { Suspense } from 'react';
import { Open_Sans } from 'next/font/google';

import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/app/class-settings/components/sidebar-nav"
import { Search } from "@/components/dashboard/search"
import TeamSwitcher from "@/components/dashboard/team-switcher"
import { UserNav } from "@/components/dashboard/user-nav"
import { MainNav } from "@/components/dashboard/main-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "./providers"





const OpenSans = Open_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js 13 + PlanetScale + NextAuth + Tailwind CSS',
  description:
    'A user admin dashboard configured with Next.js, PlanetScale, NextAuth, Tailwind CSS, TypeScript, ESLint, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={OpenSans.className}>
      <body className="h-full" suppressHydrationWarning={true}>
        <Suspense fallback="...">
          {}
          
        </Suspense>
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <TeamSwitcher />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  <Search />
                  <UserNav />
                </div>
            </div>
        </div>
            
        <div>          
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
