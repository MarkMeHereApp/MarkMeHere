'use client';

import { CourseMember } from '@prisma/client';
import StudentPieChart from './StudentPieChart';
import { trpc } from '@/app/_trpc/client';
import { useEffect } from 'react';
import * as React from 'react';
import { AttendanceEntry } from '@prisma/client';
import { Icons } from '@/components/ui/icons';

interface AttendanceViewProp {
    selectedStudent: CourseMember;
}

const AttendanceView: React.FC<AttendanceViewProp>= ({selectedStudent}) => {
    const [attendanceEntries, setAttendanceEntries] = React.useState<AttendanceEntry[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const getCourseMemberAttendanceEntriesOfCourse = trpc.attendance.getCourseMemberAttendanceEntriesOfCourse.useQuery(
        {
            courseMemberId: selectedStudent.id 
        },
        {
            onSuccess: (data) => {
                if (!data) return; 
                setAttendanceEntries(() => data.attendanceEntries);
                setIsLoading(false);
            }
        }
    );
    
    useEffect(() => {
      getCourseMemberAttendanceEntriesOfCourse.refetch();
    }, [])

  return (
    <div className="flex h-full w-full">
      <div className="w-full h-full p-4">
        {isLoading ? ( 
            <div className="pt-8 flex justify-center items-center">
                <Icons.logo
                    className="wave primary-foreground"
                    style={{ height: '100px', width: '100px' }}
                />
            </div>
            ) : attendanceEntries?.length > 0 ? (
                <StudentPieChart attendanceEntries={attendanceEntries} />
            ) : (
                <div className="pt-8 flex justify-center items-center">
                    <span className="text-1xl">
                        Statistics will appear here once you have attendance data.
                    </span>
                </div>
            )   
        }
      </div>
    </div>
  );
};

export default AttendanceView;
