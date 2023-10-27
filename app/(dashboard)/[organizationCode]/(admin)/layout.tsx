import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/general/sidebar-nav';
import { getServerSession } from 'next-auth';
import prisma from '@/prisma';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { redirect } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';

export default async function SchoolLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string };
}) {
  const organizationCode = params.organizationCode;

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

  const sidebarNavItems = [
    {
      title: 'Manage Users',
      href: `/${organizationCode}/manage-site-users`
    },
    {
      title: 'Admin Settings',
      href: `/${organizationCode}/admin-settings`
    }
  ];

  return (
    <>
      <div className="space-y-6 p-10 pb-16">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>

          <Link href={`/${organizationCode}`}>
            <ContinueButton name="Go Back To App" />
          </Link>
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
