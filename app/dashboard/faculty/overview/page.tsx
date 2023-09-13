'use client';

import { useCourseContext } from '@/app/course-context';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Stars from '@/components/background/stars';
import { firaSansFont } from '@/utils/fonts';
import { Icons } from '@/components/ui/icons';
import { useLecturesContext } from '../lecture-context';
import { NoCourse } from './components/no-course';
import { NoLecture } from './components/no-lecture';
import CRUDButtons from '@/utils/devUtilsComponents/CRUDButtons';
import isDevMode from '@/utils/isDevMode';

const OverviewAnalytics = dynamic(() => import('./analytics'));

export default function Overview() {
  const { selectedCourseId, userCourses, courseMembersOfSelectedCourse } =
    useCourseContext();
  const { lectures } = useLecturesContext();
  const selectedCourseName = userCourses?.find((courses) => {
    return courses.id === selectedCourseId;
  })?.name;

  const session = useSession();
  const userName = session?.data?.user?.name || '';

  const OverviewAnalyticsPage = () => {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="block h-full flex-1 flex-col space-y-4 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {`Welcome to ${selectedCourseName},
              ${userName.substring(0, userName.indexOf(' '))}!`}
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full h-full space-y-2">
                {selectedCourseId && lectures && lectures.length > 0 ? (
                  <OverviewAnalytics />
                ) : (
                  <NoLecture />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!selectedCourseId) return <NoCourse />;
  if (!courseMembersOfSelectedCourse) return <></>;
  return <OverviewAnalyticsPage />;
}
