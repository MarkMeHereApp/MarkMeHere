'use client';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/generate-qr-code';
import { useCourseContext } from '@/app/context-course';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';
import { useLecturesContext } from '@/app/context-lecture';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useRouter from next/router
import { toast } from 'components/ui/use-toast';

export default function ManageAttendance() {
  const { selectedCourseId, selectedAttendanceDate, selectedCourseRole } =
    useCourseContext();
  const { lectures } = useLecturesContext();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams(); // Initialize useSearchParams

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['getAllLecturesAndAttendance']
    });

    if (searchParams.has('qr-warning')) {
      toast({
        title: 'Unable To Display QR Code.',
        description:
          'You must create a lecture before you can generate a QR code.',
        icon: 'warning'
      });
    }
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

  const getCurrentLectureProp = getCurrentLecture();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2 space-x-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Mark Attendance Status
          </h2>
          {getCurrentLecture() && getCurrentLectureProp && (
            <StartScanningButton lectureId={getCurrentLectureProp.id} />
          )}
        </div>
        {selectedCourseId ? (
          <>
            <DataTable columns={columns} />
          </>
        ) : (
          <CreateChooseCourseAnimation />
        )}
      </div>
    </div>
  );
}
