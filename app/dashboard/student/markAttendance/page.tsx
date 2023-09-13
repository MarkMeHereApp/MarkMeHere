import prisma from '@/prisma';
import { AttendanceEntry } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { zAttendanceStatus, zCourseRoles } from '@/types/sharedZodTypes';
import MarkAttendanceError from './components/mark-attendance-error';
import MarkAttendanceSuccess from './components/mark-attendance-success';
import { formatString } from '@/utils/globalFunctions';
import { attendanceTokenExpirationTime } from '@/utils/globalVariables';

async function findAttendanceToken(
  attendanceTokenId: string,
  lectureId: string
) {
  return await prisma.attendanceToken.findFirst({
    where: {
      id: attendanceTokenId,
      lectureId: lectureId
    }
  });
}

async function findCourseMember(courseId: string, email: string) {
  return await prisma.courseMember.findFirst({
    where: {
      courseId: courseId,
      email: email
    }
  });
}

async function deleteAttendanceToken(
  attendanceTokenId: string,
  lectureId: string
) {
  return await prisma.attendanceToken.delete({
    where: {
      id: attendanceTokenId,
      lectureId: lectureId
    }
  });
}

async function findAttendanceEntry(lectureId: string, courseMemberId: string) {
  return await prisma.attendanceEntry.findFirst({
    where: {
      lectureId: lectureId,
      courseMemberId: courseMemberId
    }
  });
}

async function updateAttendanceEntry(id: string) {
  return await prisma.attendanceEntry.update({
    where: {
      id: id
    },
    data: {
      status: zAttendanceStatus.enum.here,
      checkInDate: new Date(Date.now())
    }
  });
}

async function createAttendanceEntry(
  lectureId: string,
  courseMemberId: string
) {
  return await prisma.attendanceEntry.create({
    data: {
      lectureId: lectureId,
      courseMemberId: courseMemberId,
      status: zAttendanceStatus.enum.here
    }
  });
}

export default async function markAttendance({
  searchParams
}: {
  searchParams: {
    attendanceTokenId: string;
    lectureId: string;
    courseId: string;
  };
}) {
  const serverSession = await getServerSession();

  const email: string | null = serverSession?.user?.email || null;
  const attendanceTokenId = searchParams.attendanceTokenId;
  const lectureId = searchParams.lectureId;
  const courseId = searchParams.courseId;
  let errorMessage: string | null = null;

  try {
    if (!email) {
      return <MarkAttendanceError message="No Valid Email" />;
    }

    const tokenRow = await findAttendanceToken(attendanceTokenId, lectureId);

    if (!tokenRow) {
      return <MarkAttendanceError message="Invalid Attendance Token" />;
    }

    if (
      tokenRow?.createdAt < new Date(Date.now() - attendanceTokenExpirationTime)
    ) {
      return <MarkAttendanceError message="Attendance Token Expired" />;
    }

    if (!tokenRow) {
      return <MarkAttendanceError message="Invalid Attendance Token" />;
    }

    const courseMember = await findCourseMember(courseId, email);

    if (courseMember?.role !== zCourseRoles.enum.student) {
      await deleteAttendanceToken(attendanceTokenId, lectureId);
      const role = courseMember?.role || '[ROLE_ERROR]';
      return (
        <MarkAttendanceError
          message={`You are a ${formatString(
            role
          )}, not a Student of this Course.`}
        />
      );
    }

    if (!courseMember) {
      return (
        <MarkAttendanceError message="Course Enrollment could not be found for this course." />
      );
    }
    const courseMemberId: string = courseMember.id;

    let attendanceEntry: AttendanceEntry | null = null;

    const existingAttendanceEntry = await findAttendanceEntry(
      lectureId,
      courseMemberId
    );

    if (existingAttendanceEntry) {
      attendanceEntry = await updateAttendanceEntry(existingAttendanceEntry.id);
    } else {
      attendanceEntry = await createAttendanceEntry(lectureId, courseMemberId);
    }

    await deleteAttendanceToken(attendanceTokenId, lectureId);

    if (!attendanceEntry) {
      return (
        <MarkAttendanceError message="Unexpected Error: No Attendance was created for this submission." />
      );
    }

    return (
      <>
        <MarkAttendanceSuccess checkInDate={attendanceEntry.checkInDate} />
      </>
    );
  } catch (error) {
    const ErrorType = error as Error;
    return <MarkAttendanceError message={ErrorType.message} />;
  }
}
