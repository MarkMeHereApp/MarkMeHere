import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/components/general/sidebar-nav';
import { getServerSession } from 'next-auth';
import { zSiteRoles } from '@/types/sharedZodTypes';

import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function SettingLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string };
}) {
  const organizationCode = params.organizationCode;

  const sidebarNavItems = [
    {
      title: 'User Settings',
      href: `/${organizationCode}/user-settings`
    }
  ];

  return (
    <>
      <div className="space-y-6 p-10 pb-16">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>

          <Link href={`/${organizationCode}`}>
            <ContinueButton name="Go to App" />
          </Link>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </>
  );
}
