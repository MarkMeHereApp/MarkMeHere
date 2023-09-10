'use client';

import { ModeToggle } from '@/app/dashboard/components/theme-toggle';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';
import CourseSelection from './course-selection'; // Import the new component

export default function MainBar() {
  return (
    <div className="border-b flex-col">
      <div className="flex items-center mt-4 mb-4 pr-8 justify-between">
        <div className="ml-4">
          <CourseSelection />
        </div>
        <div className="flex align-top items-center justify-end space-x-4 mt-0 p-0">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="flex px-4">
        <MainNav />
      </div>
    </div>
  );
}
