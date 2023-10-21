'use client';

import { ModeToggle } from '@/components/theme/theme-toggle';
import UserNav from './user-nav';
import MainNav from './main-nav';
import CourseSelection from './course-selection'; // Import the new component
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { usePathname } from 'next/navigation'; // Import the useRouter hook

export default function MainBar({
  lightTheme,
  darkTheme
}: {
  lightTheme: string;
  darkTheme: string;
}) {
  const isQRCodePage = usePathname() === '/qr';

  const divClassName = !isQRCodePage
    ? 'border-b flex-col'
    : 'border-b flex-col hover:opacity-100 opacity-0 transition-opacity duration-200 absolute w-full z-10 bg-background';

  return (
    <div className={divClassName}>
      <div className="flex items-center pb-2 pr-8 justify-between">
        <div className="flex flex-row items-center ml-6 space-x-2 mt-2 mr-4">
          <Link href="/overview" className="-mr-2">
            <Icons.logo
              className="hover:wave-infinite"
              style={{ flex: 1, width: '50px', height: '50px' }}
            />
          </Link>
          <Icons.slash style={{ width: '50px', height: '50px' }} />
          <CourseSelection />
        </div>
        <div className="flex align-top items-center justify-end space-x-4 mt-2">
          <ModeToggle lightTheme={lightTheme} darkTheme={darkTheme} />
          <UserNav />
        </div>
      </div>
      <div className="flex px-6">
        <MainNav />
      </div>
    </div>
  );
}
