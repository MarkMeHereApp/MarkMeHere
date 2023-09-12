'use client';

import { useCourseContext } from '@/app/course-context';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';
import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';
import isDevMode from '@/utils/isDevMode';
import OverviewAnalytics from './analytics';

export default function Overview() {
  const { selectedCourseId } = useCourseContext();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-4 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex flex-col">
          {/* Welcome Header */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-full space-y-2">
              <div className="basis-1/5">
                {selectedCourseId ? (
                  <MarkMeHereClassAnimation />
                ) : (
                  <CreateChooseCourseAnimation />
                )}
              </div>
              {/* TODO: Dashboard Content */}
              {isDevMode && selectedCourseId && (
                <div className="basis-4/5">
                  <OverviewAnalytics />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
