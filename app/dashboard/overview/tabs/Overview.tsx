'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import ContainerCardComponent from './AttendancePieChart/ContainerCardComponent';

const handleClick = async () => {
  const response = await fetch('/api/prisma', {
    method: 'POST'
  });
};

const Overview = () => {
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
                'text-sm font-medium text-muted-foreground transition-colors hover:text-primary w-full'
              }
            >
              Add Random User to DB
            </Button>
          </CardHeader>
          <CardContent>
            <ContainerCardComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
