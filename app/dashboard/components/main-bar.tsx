'use client';

import * as React from 'react';
import { ModeToggle } from '@/app/dashboard/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';
import CourseSelection from './course-selection'; // Import the new component

export default function MainBar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <CourseSelection className="mx-6" /> {/* Use the new component */}
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
