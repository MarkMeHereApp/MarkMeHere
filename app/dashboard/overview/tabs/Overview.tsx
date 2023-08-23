import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import AttendancePieChart from './AttendancePieChart';

const Overview = () => {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription>Nice!</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendancePieChart />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Overview;
