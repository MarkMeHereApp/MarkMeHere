import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/general/date-range-picker';
import { Metadata } from 'next';
import { ModeToggle } from './theme-toggle';
import Overview from './tabs/Overview';
import Reference from './tabs/Reference';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Example dashboard app built using the components.'
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div>
        <h2>Dashboard</h2>
        <div>
          <ModeToggle />
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
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
          <TabsContent value="overview">
            <Overview />
          </TabsContent>
          <TabsContent value="reference">
            <Reference />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
