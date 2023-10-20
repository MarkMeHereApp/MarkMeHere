import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/general/sidebar-nav';
import { getServerSession } from 'next-auth';
import prisma from '@/prisma';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';

const sidebarNavItems = [
  {
    title: 'Manage Courses',
    href: '/manage-courses'
  },
  {
    title: 'Manage Users',
    href: '/manage-site-users'
  },
  {
    title: 'Admin Settings',
    href: '/admin-settings'
  }
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({
  children
}: SettingsLayoutProps) {
  const session = await getServerSession();

  const email = session?.user?.email;

  if (!email) {
    signOut();
    return <></>;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  // the temp admin secret is only enabled during the first time setup.
  if (
    user?.role !== zSiteRoles.enum.admin &&
    !process.env.FIRST_TIME_SETUP_ADMIN_PASSWORD
  ) {
    redirect('/');
    return <></>;
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Admin Settings</h2>
          <p className="text-muted-foreground">
            Configure global site settings.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </>
  );
}
