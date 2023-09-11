'use client';

import { ModeToggle } from '@/app/dashboard/components/theme-toggle';
import UserNav from '@/app/dashboard/components/user-nav';
import MainNav from '@/app/dashboard/components/main-nav';
import CourseSelection from './course-selection'; // Import the new component
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';

export default function MainBar() {
  return (
    <div className="border-b flex-col">
      <div className="flex items-center mt-2 pb-4 pr-8 justify-between">
        <div className="flex flex-row items-center ml-6 space-x-2">
          <Link href="/dashboard/faculty/overview" className="-mr-2">
            <Icons.logo style={{ flex: 1, width: '50px', height: '50px' }} />
          </Link>
          <Icons.slash style={{ width: '50px', height: '50px' }} />
          <CourseSelection />
        </div>
        <div className="flex align-top items-center justify-end space-x-6 mt-0 p-0">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
      <div className="flex px-6">
        <MainNav />
      </div>
    </div>
  );
}
