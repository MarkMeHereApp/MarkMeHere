'use client';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/generate-qr-code';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';
import { useLecturesContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useRouter from next/router
import { toast } from 'components/ui/use-toast';
import { SyncCanvasGrade } from '@/utils/devUtilsComponents/SyncCanvasGrade';

export default function ManageAttendance() {
  const { selectedCourseId } = useCourseContext();
  const { lectures, selectedAttendanceDate } = useLecturesContext();
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
      <div className="block h-full flex-1 flex-col space-y-8  md:flex py-8 px-2 sm:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>

          <div className="flex items-center space-x-2">
            <SyncCanvasGrade />
            {getCurrentLecture() && getCurrentLectureProp && (
              <StartScanningButton lectureId={getCurrentLectureProp.id} />
            )}
          </div>
        </div>

        <DataTable columns={columns} />
      </div>
    </div>
  );
}
