'use client';

import { useCourseContext } from '@/app/context-course';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useLecturesContext } from '../../../context-lecture';
import { NoCourse } from './components/no-course';
import { NoLecture } from './components/no-lecture';

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
        <div className="block h-full w-full flex-1 flex-col space-y-4 p-8 md:flex">
        <span className="text-3xl font-bold tracking-tight">
          {`Welcome to ${selectedCourseName}, ${userName.substring(0, userName.indexOf(' '))}!`}
        </span>
        {selectedCourseId && lectures && lectures.length > 0 ? (
          <OverviewAnalytics />
        ) : (
          <NoLecture />
        )}
        </div>
      </div>
    );
  };

  if (!selectedCourseId) return <NoCourse />;
  if (!courseMembersOfSelectedCourse) return <></>;
  if (!lectures) return <></>; //@TODO Maybe add a skeleton here?
  return <OverviewAnalyticsPage />;
}
