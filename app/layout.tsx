import '@/styles/globals.css';
import '@/styles/styles.scss';

import { Suspense } from 'react';
import { Open_Sans } from 'next/font/google';


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
