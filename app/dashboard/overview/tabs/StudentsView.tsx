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

const handleAddRandomPersonClick = async () => {
  const response = await fetch('/api/prisma', {
    method: 'POST'
  });
};

const StudentsView = () => {
  return (
    <div className="w-full">
      {/* Adjust the width of the card using Flexbox */}
      <Card className="flex-grow w-1/2">
        <CardHeader>
          <CardTitle>Student Attendance Statistics</CardTitle>
          <CardDescription>
            Click a student to view their attendance percentage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContainerCardComponent />
        </CardContent>
        <Button
          variant={'ghost'}
          onClick={() => handleAddRandomPersonClick()}
          className={
            'text-sm font-medium text-foreground transition-colors hover:text-background w-1/2 border-2'
          }
        >
          + Add Random User to DB +
        </Button>
      </Card>
    </div>
  );
};

export default StudentsView;
