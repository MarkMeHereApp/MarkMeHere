'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import AttendancePieChart from './AttendancePieChart';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

const handleClick = async () => {
  const response = await fetch('/api/prisma', {
    method: 'POST'
  });
};

const Overview = () => {
  const pathname = usePathname(); // Use the hook

  // A helper function to determine if the link is active
  function isActive(href: string) {
    return pathname === href;
  }

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
        <Button
          onClick={() => handleClick()}
          className={
            isActive('/dashboard/take-attendance')
              ? 'text-sm font-medium text-primary'
              : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary'
          }
        >
          Add Random User to DB
        </Button>
      </div>
    </>
  );
};

export default Overview;
