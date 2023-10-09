'use client';

import * as React from 'react';
import { useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { toast } from 'components/ui/use-toast';
import { useCourseContext } from '@/app/context-course';
import { useSession } from 'next-auth/react';
import AttendanceView from "./statistics/AttendanceView";
import { trpc } from "@/app/_trpc/client";
import { CourseMember } from "@prisma/client";

const StudentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const { selectedCourseId, selectedCourseRole } = useCourseContext();

  const session = useSession();
  const userName = session?.data?.user?.name || '';
  const userEmail = session.data?.user?.email;
  const [student, setStudent] = React.useState<CourseMember>();

  const getCourseMemberOfCourseQuery = trpc.courseMember.getCourseMemberOfCourse.useQuery(
    {
        courseId: selectedCourseId || '',
        email: userEmail || ''
    },
    {
        onSuccess: (data) => {
            if (!data) return;
            if (data.courseMember) {
                setStudent(data.courseMember);
            }
        }
    }
  );

  useEffect(() => {
    getCourseMemberOfCourseQuery.refetch();
    if (searchParams.has('qr-warning')) {
      toast({
        title: 'Unable To Display QR Code.',
        description:
          'You must be a Professor or TA in the selected course to generate a QR code.',
        icon: 'warning'
      });
    }
  }, []);
 
  return (
    <div className="flex flex-col md:flex-row">
        <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
            {student ? ( 
                <>
                    <span className="text-3xl font-bold tracking-tight">
                        {`Welcome ${userName.substring(0, userName.indexOf(' '))}!`}
                    </span>
                    <AttendanceView selectedStudent={student}/>
                </>
                ) : (
                   null
                )
            }
        </div>
    </div>
  );
};

export default StudentPage;
