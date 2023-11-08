import * as React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import UserNav from '../[courseCode]/components/user-nav';

export default function NoCoursesAndUser() {
  const cookieStore = cookies();
  const callbackUrl = cookieStore.get('next-auth.callback-url');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[600px] border-destructive">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex justify-between">
            You Have No Courses!
            <UserNav />
          </CardTitle>
          <CardDescription className="text-lg">
            Please Contact an Administrator to be added to a course.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
