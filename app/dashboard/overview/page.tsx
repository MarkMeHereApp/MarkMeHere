import { Button } from '@/components/ui/button';
import { CalendarDateRangePicker } from '@/components/general/date-range-picker';
import DashboardView from './components/DashboardView';
import { ModeToggle } from './components/theme-toggle';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

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
  const _session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:w-1/2 p-8 md:p-12">
        <HeaderView />
        <DashboardView />
      </div>
    </div>
  );
}
