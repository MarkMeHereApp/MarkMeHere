import './globals.css';
import '@/styles/styles.scss';

import Nav from './nav';
import AnalyticsWrapper from './analytics';
import Toast from './toast';
import { Suspense } from 'react';

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
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Suspense fallback="...">
          {/* @ts-expect-error Server Component */}
          <Nav />
        </Suspense>
        <main>
        {children}
        </main>
        <AnalyticsWrapper />
        {/* <Toast /> We may not want to always include the footer. If we even want one at all*/}
      </body>
    </html>
  );
}
