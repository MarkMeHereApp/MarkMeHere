'use client';

import * as React from 'react';
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { useCourseContext } from '@/app/context-course';
import { useSession } from 'next-auth/react';
import AttendanceView from './AttendanceView';
import { CourseMember } from "@prisma/client";
import MarkAttendanceSuccess from '@/app/(dashboard)/(student)/markAttendance/components/mark-attendance-success';

interface StudentPageBoardProp {
    dateMarked?: Date;
}

const StudentPageBoard: React.FC<StudentPageBoardProp> = ({dateMarked}) => {
  const session = useSession();
  const userName = session?.data?.user?.name || '';
  const userEmail = session.data?.user?.email;
  const { courseMembersOfSelectedCourse } = useCourseContext();
  const [student, setStudent] = React.useState<CourseMember>();
  const [showSuccess, setShowSuccess] = React.useState(true);

    // for future use 
    //   const searchParams = useSearchParams();
    //   const attendanceEntry = searchParams ? searchParams.get('attendanceEntry') : null; //storing the searchParams with 'error' included, that is then being used the in the UseEffect below

    const getCourseMember = () => {
        if (courseMembersOfSelectedCourse) {
          const selectedCourseMember: CourseMember | undefined = courseMembersOfSelectedCourse.find(
            (member) => member.email === userEmail
          );
          if (selectedCourseMember) {

            setStudent(selectedCourseMember);
            return selectedCourseMember;
          }
          return null;
        }
    }

    useEffect(() => {
        if (dateMarked) {
          // Set a timeout to hide the success message after 5 seconds
          const timeoutId = setTimeout(() => {
            setShowSuccess(false);
            getCourseMember();
          }, 5000); 
    
          return () => {
            clearTimeout(timeoutId);
          };
        }
        getCourseMember();
      }, []);
    
  return (
    <div className="flex flex-col md:flex-row">
        <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {showSuccess && dateMarked ? (
            <MarkAttendanceSuccess dateMarked={dateMarked} />
        ) : (
            student && (
            <>
                <span className="text-3xl font-bold tracking-tight">
                {`Welcome ${userName.substring(0, userName.indexOf(' '))}!`}
                </span>
                <AttendanceView selectedStudent={student} />
            </>
            )
        )}
        </div>
  </div>
  );
};

export default StudentPageBoard;
