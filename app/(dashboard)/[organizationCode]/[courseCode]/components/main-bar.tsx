'use client';

import { ModeToggle } from '@/app/(dashboard)/[organizationCode]/components/theme-toggle';
import UserNav from './user-nav';
import MainNav from './main-nav';
import CourseSelection from './course-selection'; // Import the new component
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import { usePathname } from 'next/navigation'; // Import the useRouter hook
import { useCourseContext } from '../context-course';
import { useOrganizationContext } from '../../context-organization';
import { useSession } from 'next-auth/react';
import isDevMode from '@/utils/isDevMode';
import { MobileNav } from './mobile-nav';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainBar() {
  const session = useSession();
  const { organizationUrl } = useOrganizationContext();
  const pathname = usePathname();
  const { currentCourseUrl, selectedCourseEnrollment } = useCourseContext();
  const isQRCodePage = usePathname() === `${currentCourseUrl}/qr`;
  const isVerificationPage =
    usePathname() === `${currentCourseUrl}/verification`;

  const divClassName =
    !isQRCodePage && !isVerificationPage
      ? 'border-b flex-col'
      : 'border-b flex-col hover:opacity-100 opacity-0 transition-opacity duration-200 absolute w-full z-10 bg-background';

  function isActive(href: string) {
    // Since the Admin Dashboard has a bunch of pages inside of it, we have to be a big janky with it, and highlight the admin dashboard for all of its pages.
    if (href === `${organizationUrl}/manage-courses`) {
      return (
        pathname === `${organizationUrl}/manage-courses` ||
        pathname === `${organizationUrl}/manage-site-users` ||
        pathname === `${organizationUrl}/admin-settings`
      );
    }
    return pathname === href;
  }

  const getLinkClassName = (path: string) => {
    const commonClasses = 'flex text-md font-medium pb-0';
    const activeLinkStyles = `${commonClasses} text-primary`;
    const inactiveLinkStyles = `${commonClasses} text-muted-foreground hover:text-primary`;
    return isActive(path) ? activeLinkStyles : inactiveLinkStyles;
  };

  const getBorderClassName = (path: string) => {
    const commonClasses = 'w-full p-3 pb-2 px-0';
    const activeBorderStyles = `${commonClasses} border-primary`;
    const inactiveBorderStyles = `${commonClasses} border-transparent hover:border-primary hover:border-solid`;
    return isActive(path) ? activeBorderStyles : inactiveBorderStyles;
  };

  type MainNavBarCustomLinkProps = {
    href: string;
    displayText: string;
  };

  const MainNavBarCustomLink: React.FC<MainNavBarCustomLinkProps> = ({
    href,
    displayText
  }) => (
    <Link href={href} className={getLinkClassName(href)}>
      <span className={getBorderClassName(href)}>{displayText}</span>
    </Link>
  );

  const CanAccessStudent = () => {
    return selectedCourseEnrollment?.role === zCourseRoles.enum.student;
  };

  const CanAccessTeacher = () => {
    if (session?.data?.user?.role === zSiteRoles.enum.admin) return true;
    return selectedCourseEnrollment?.role === zCourseRoles.enum.teacher;
  };

  const NavComponents = [
    CanAccessStudent() && (
      <MainNavBarCustomLink
        href={`${currentCourseUrl}/student`}
        displayText="Student"
      />
    ),
    CanAccessTeacher() && (
      <MainNavBarCustomLink
        href={`${currentCourseUrl}/overview`}
        displayText="Overview"
      />
    ),
    CanAccessTeacher() && (
      <MainNavBarCustomLink
        href={`${currentCourseUrl}/attendance`}
        displayText="Attendance"
      />
    ),
    CanAccessTeacher() && (
      <MainNavBarCustomLink
        href={`${currentCourseUrl}/members`}
        displayText="Members"
      />
    ),
    isDevMode && (
      <MainNavBarCustomLink
        href={`${currentCourseUrl}/testing-playground`}
        displayText="Testing"
      />
    )
  ];
  return (
    <div className={divClassName}>
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-row sm:items-center ml-6 sm:space-x-2 mr-4">
          <div className="hidden lg:flex justify-center items-center">
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
        {session.status === 'loading' ? (
          <div className="px-6">
            <Skeleton className="w-48 h-6 " />
          </div>
        ) : (
          <>
            <div className="md:hidden">
              <MobileNav NavItems={NavComponents} />
            </div>
            <div className="hidden md:block">
              <MainNav NavItems={NavComponents} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
