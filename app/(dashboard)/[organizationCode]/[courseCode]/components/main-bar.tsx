'use client';

import { ModeToggle } from '@/app/(dashboard)/[organizationCode]/components/theme-toggle';
import UserNav from './user-nav';
import MainNav from './main-nav';
import CourseSelection from './course-selection'; // Import the new component
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '../context-course';

export default function MainBar() {
  const { currentCourseUrl } = useCourseContext();
  const isQRCodePage = usePathname() === `${currentCourseUrl}/qr`;
  const isVerificationPage =
    usePathname() === `${currentCourseUrl}/verification`;

  const divClassName =
    !isQRCodePage && !isVerificationPage
      ? 'border-b flex-col'
      : 'border-b flex-col hover:opacity-100 opacity-0 transition-opacity duration-200 absolute w-full z-10 bg-background';

  return (
    <div className={divClassName}>
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-row sm:items-center ml-6 sm:space-x-2 mr-4">
          <div className="hidden sm:flex justify-center items-center">
            <Link href={`${currentCourseUrl}/overview`}>
              <Icons.logo
                className="hover:wave-infinite"
                style={{ width: '45px', height: '45px' }}
              />
            </Link>
            <Icons.slash style={{ width: '50px', height: '50px' }} />
          </div>
          <CourseSelection />
        </div>
        <div className="flex align-top items-center justify-end">
          <div className="flex pl-2">
            <MainNav />
          </div>
          <Icons.line
            className="ml-1 -mr-3"
            style={{ width: '50px', height: '50px' }}
          />
          <ModeToggle />
          <div className="pl-4 pr-8">
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}
