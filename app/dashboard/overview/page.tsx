import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/general/date-range-picker';
import { Metadata } from 'next';
import { ModeToggle } from './theme-toggle';
import Overview from './tabs/Overview';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.'
};

const HeaderView = () => {
  return (
    <div className="flex items-center justify-between space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <CalendarDateRangePicker />
        <Button>Download</Button>
      </div>
    </div>
  );
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeaderView />
        <Tabs defaultValue="students">
          <TabsList>
            <TabsTrigger value="overview" disabled>
              Overview
            </TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="students">
            <Overview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
