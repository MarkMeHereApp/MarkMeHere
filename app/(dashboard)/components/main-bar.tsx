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
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-row sm:items-center ml-6 sm:space-x-2 mr-4">
            <div className="hidden sm:flex justify-center items-center">
                <Link href="/overview" >
                    <Icons.logo
                    className="hover:wave-infinite"
                    style={{  width: '45px', height: '45px' }}
                    />
                </Link>
                <Icons.slash style={{width:'50px', height:'50px'}}/>
            </div>
            <CourseSelection />
        </div>
        <div className="flex align-top items-center justify-end">
          <div className="flex pl-2">
            <MainNav />
          </div>
          <Icons.line className='ml-1 -mr-3' style={{width:'50px', height:'50px'}}/>
          <ModeToggle lightTheme={lightTheme} darkTheme={darkTheme} />
          <div className="pl-4 pr-8">
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}
