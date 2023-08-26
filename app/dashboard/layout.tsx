import { Metadata } from 'next';
import Search from '@/app/dashboard/components/search';
import TeamSwitcher from '@/app/dashboard/components/team-switcher';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard to manage your classes'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      <div>{children}</div>
    </>
  );
}
