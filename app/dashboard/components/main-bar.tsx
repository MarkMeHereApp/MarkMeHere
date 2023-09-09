'use client';

import * as React from 'react';
import { ModeToggle } from '@/app/dashboard/components/theme-toggle';
import { Separator } from '@/components/ui/separator';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';
import CourseSelection from './course-selection'; // Import the new component

export default function MainBar() {
  return (
    <div className="border-b ">
      <div className="">
        <div className=" items-center mt-4 mx-4  pr-8">
          <CourseSelection />
        </div>
        <div className="flex items-center justify-end space-x-4 mx-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="flex mx-6 mt-4 h-2 items-center px-4">
        <MainNav className="-mt-10" />
      </div>
    </div>
  );
}
