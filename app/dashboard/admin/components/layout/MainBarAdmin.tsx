'use client';

import { ModeToggle } from '@/app/dashboard/components/theme-toggle';
import AdminNav from '@/app/dashboard/admin/components/layout/AdminNav';
import MainNavAdmin from '@/app/dashboard/admin/components/layout/MainNavAdmin';
//import CourseSelection from './course-selection'; // Import the new component

export default function MainBarAdmin() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* <CourseSelection className="mx-6" /> Use the new component */}
        <MainNavAdmin />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <AdminNav />
        </div>
      </div>
    </div>
  );
}
