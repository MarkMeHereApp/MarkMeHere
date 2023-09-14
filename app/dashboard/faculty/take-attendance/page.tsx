'use client';

import CRUDButtons from '@/utils/devUtilsComponents/CRUDButtons';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/generate-qr-code';
import { useCourseContext } from '@/app/course-context';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';
import { useLecturesContext } from '@/app/lecture-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export default function ManageAttendance() {
  const { selectedCourseId, selectedAttendanceDate } = useCourseContext();
  const { lectures } = useLecturesContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['getAllLecturesAndAttendance']
    });
  }, []);

  const getCurrentLecture = () => {
    if (lectures && selectedAttendanceDate) {
      return lectures.find((lecture) => {
        return (
          lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Mark Attendance Status
          </h2>
          {getCurrentLecture() && <StartScanningButton />}
        </div>
        {selectedCourseId ? (
          <>
            <CRUDButtons />
            <DataTable columns={columns} />
          </>
        ) : (
          <CreateChooseCourseAnimation />
        )}
      </div>
    </div>
  );
}
