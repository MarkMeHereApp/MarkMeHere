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
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Class Attendance</CardTitle>
          <CardDescription>Nice!</CardDescription>
          <Button
            onClick={() => handleAddRandomPersonClick()}
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
  );
};

export default StudentsView;
