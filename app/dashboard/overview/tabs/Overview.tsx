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
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        {/* Adjust the width of the card using Flexbox */}
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Class Attendance</CardTitle>
            <CardDescription>Nice!</CardDescription>
            <Button
              onClick={() => handleClick()}
              className={
                isActive('/dashboard/take-attendance')
                  ? 'text-sm font-medium text-primary w-full'
                  : 'text-sm font-medium text-muted-foreground transition-colors hover:text-primary w-full'
              }
            >
              Add Random User to DB
            </Button>
          </CardHeader>
          <CardContent>
            <AttendancePieChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
