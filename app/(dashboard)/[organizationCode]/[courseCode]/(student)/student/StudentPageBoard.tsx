'use client';

import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useSession } from 'next-auth/react';
import { CourseMember } from '@prisma/client';
import MarkAttendanceSuccess from '../markAttendance/components/mark-attendance-success';
import StudentAttendanceEntriesTable from './components/StudentAttendanceEntriesTable';
import AttendanceStatuses from './components/AttendanceStatuses';
import { AttendanceEntry } from '@prisma/client';
import { Icons } from '@/components/ui/icons';
import StudentPieChart from './components/StudentPieChart';
import { useState } from 'react';
import { useLecturesContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';

interface StudentPageBoardProp {
  studentId?: string;
  dateMarked?: Date;
}

const StudentPageBoard: React.FC<StudentPageBoardProp> = ({
  studentId,
  dateMarked
}) => {
  const session = useSession();
  const userName = session?.data?.user?.name || '';
  const userEmail = session.data?.user?.email;
  const [showSuccess, setShowSuccess] = React.useState(true);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const { courseMembersOfSelectedCourse } = useCourseContext();
  const { lectures } = useLecturesContext();

  // for future use
  //   const searchParams = useSearchParams();
  //   const attendanceEntry = searchParams ? searchParams.get('attendanceEntry') : null; //storing the searchParams with 'error' included, that is then being used the in the UseEffect below

  const getCourseMember = () => {
    if (courseMembersOfSelectedCourse) {
      const selectedCourseMember: CourseMember | undefined =
        courseMembersOfSelectedCourse.find(
          (member) => member.email === userEmail
        );
      if (selectedCourseMember) {
        return selectedCourseMember;
      }
      return null;
    }
  };

  const calculateAttendanceEntryData = (
    attendanceEntries: AttendanceEntry[]
  ) => {
    const totalAttendanceEntries = attendanceEntries.length;

    // attended (green), not attended (red)
    const colors = ['#2B7113', '#C1201B'];

    const hereEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
      return entry.status === 'here';
    });
    const excusedEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
        return entry.status === 'excused';
    });
    const lateEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
      return entry.status === 'late';
    });
    const absentEntries = attendanceEntries.filter((entry: AttendanceEntry) => {
      return entry.status === 'absent';
    });

    const pieData = [
      {
        label: 'Attended',
        name: 'Attended',
        value:
          ((hereEntries.length + lateEntries.length) / (totalAttendanceEntries - excusedEntries.length)) * 100,
        fill: colors[0]
      },
      {
        label: 'Not Attended',
        name: 'Not Attended',
        value: (absentEntries.length / totalAttendanceEntries) * 100,
        fill: colors[1]
      }
    ];

    const statusData = [
      {
        label: 'Here',
        name: 'Here',
        value: Math.round((hereEntries.length / totalAttendanceEntries) * 100)
      },
      {
        label: 'Excused',
        name: 'Excused',
        value: Math.round((excusedEntries.length / totalAttendanceEntries) * 100)
      },
      {
        label: 'Late',
        name: 'Late',
        value: Math.round((lateEntries.length / totalAttendanceEntries) * 100)
      },
      {
        label: 'Absent',
        name: 'Absent',
        value: Math.round((absentEntries.length / totalAttendanceEntries) * 100)
      }
    ];
    setAttendanceData([pieData, statusData]);
  };

  const getAttendanceEntries = () => {
    const attendanceEntries: AttendanceEntry[] = [];

    lectures?.forEach((lecture) => {
      lecture.attendanceEntries.forEach((entry) => {
        if (studentId && entry.courseMemberId === studentId) {
          attendanceEntries.push(entry);
          console.log(studentId);
        } else if (entry.courseMemberId === getCourseMember()?.id) {
          attendanceEntries.push(entry);
        }
      });
    });
    calculateAttendanceEntryData(attendanceEntries);
    return attendanceEntries;
  };

  const attendanceEntries = useMemo(() => getAttendanceEntries(), [lectures]);

  useEffect(() => {
    if (dateMarked) {
      // Set a timeout to hide the success message after 5 seconds
      const timeoutId = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
    setShowSuccess(false);
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {showSuccess && dateMarked ? (
          <MarkAttendanceSuccess dateMarked={dateMarked} />
        ) : (
          userName &&
          attendanceEntries && (
            <>
              {!studentId && (
                <span className="text-3xl font-bold tracking-tight">
                  {`Welcome ${userName.substring(0, userName.indexOf(' '))}!`}
                </span>
              )}
              {!lectures ? (
                <div className="pt-8 flex justify-center items-center">
                  <Icons.logo
                    className="wave primary-foreground"
                    style={{ height: '100px', width: '100px' }}
                  />
                </div>
              ) : attendanceEntries.length > 0 ? (
                <>
                  <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 w-full">
                    <div className="flex flex-col space-y-4 md:w-3/4">
                      <AttendanceStatuses attendanceData={attendanceData[1]} />
                      <StudentPieChart pieChartData={attendanceData[0]} />
                    </div>
                    <div className="w-full md:w-1/4">
                      <StudentAttendanceEntriesTable
                        attendanceEntries={attendanceEntries}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-8 flex justify-center items-center">
                  {!studentId ? (
                    <span className="text-1xl">
                      Statistics will appear here once you have attendance data.
                    </span>
                  ) : (
                    <span className="text-1xl">
                      Student has no attendance data.
                    </span>
                  )}
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default StudentPageBoard;
