'use client';

import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default async function markAttendance({
  searchParams
}: {
  searchParams: {
    attendanceTokenId: string;
    lectureId: string;
    courseId: string;
  };
}) {
  const markPresent =
    trpc.recordQRAttendance.useTokenToMarkAttendance.useMutation();

  const [finishedMarking, setFinishedMarking] = useState(false);
  const session = useSession();
  const email: string | null = session?.data?.user?.email || null;
  const attendanceTokenId = searchParams.attendanceTokenId;
  const lectureId = searchParams.lectureId;
  const courseId = searchParams.courseId;

  useEffect(() => {
    const markAttendance = async () => {
      if (!email) throw new Error('No email found');
      if (!attendanceTokenId) throw new Error('No attendanceTokenId found');
      if (!lectureId) throw new Error('No lectureId found');
      if (!courseId) throw new Error('No courseId found');

      const response = await markPresent.mutateAsync({
        email,
        attendanceTokenId,
        lectureId,
        courseId
      });

      if (!response.success) throw new Error('Failed to mark attendance');

      setFinishedMarking(true);
    };

    markAttendance();
  }, []);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        {finishedMarking ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center">
              You have successfully marked your attendance!
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center">
              Marking your attendance...
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
