import StudentPageBoard from './StudentPageBoard';
import prisma from '@/prisma';
import { AttendanceEntry } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { zAttendanceStatus, zCourseRoles } from '@/types/sharedZodTypes';
import MarkAttendanceError from '../markAttendance/components/mark-attendance-error';
import { formatString } from '@/utils/globalFunctions';
import { attendanceTokenExpirationTime } from '@/utils/globalVariables';

async function findAttendanceToken(attendanceTokenId: string) {
  return await prisma.attendanceToken.findFirst({
    where: {
      id: attendanceTokenId
    }
  });
}

async function findCourseId(lectureId: string) {
  const lecture = await prisma.lecture.findFirst({
    where: {
      id: lectureId
    }
  });
  return lecture?.courseId;
}

async function findCourseMember(courseId: string, email: string) {
  return await prisma.courseMember.findFirst({
    where: {
      courseId: courseId,
      email: email
    }
  });
}

async function deleteAttendanceToken(attendanceTokenId: string) {
  return await prisma.attendanceToken.delete({
    where: {
      id: attendanceTokenId
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
      dateMarked: new Date(Date.now())
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

async function createAttendanceEntryWithLocation(
  lectureId: string,
  courseMemberId: string,
  ProfessorLectureGeolocationId: string,
  studentLatitude: number,
  studentLongitude: number
) {
  return await prisma.attendanceEntry.create({
    data: {
      lectureId: lectureId,
      courseMemberId: courseMemberId,
      status: zAttendanceStatus.enum.here,
      ProfessorLectureGeolocationId: ProfessorLectureGeolocationId,
      studentLatitude: studentLatitude,
      studentLongtitude: studentLongitude
    }
  });
}

async function updateAttendanceEntryWithLocation(
  id: string,
  ProfessorLectureGeolocationId: string,
  studentLatitude: number,
  studentLongitude: number
) {
  return await prisma.attendanceEntry.update({
    where: {
      id: id
    },
    data: {
      status: zAttendanceStatus.enum.here,
      dateMarked: new Date(Date.now()),
      ProfessorLectureGeolocationId: ProfessorLectureGeolocationId,
      studentLatitude: studentLatitude,
      studentLongtitude: studentLongitude
    }
  });
}

async function createAttendanceEntryWithoutStudentLocation(
  lectureId: string,
  courseMemberId: string,
  ProfessorLectureGeolocationId: string
) {
  return await prisma.attendanceEntry.create({
    data: {
      lectureId: lectureId,
      courseMemberId: courseMemberId,
      status: zAttendanceStatus.enum.here,
      ProfessorLectureGeolocationId: ProfessorLectureGeolocationId
    }
  });
}

async function updateAttendanceEntryWithoutStudentLocation(
  id: string,
  ProfessorLectureGeolocationId: string
) {
  return await prisma.attendanceEntry.update({
    where: {
      id: id
    },
    data: {
      status: zAttendanceStatus.enum.here,
      dateMarked: new Date(Date.now()),
      ProfessorLectureGeolocationId: ProfessorLectureGeolocationId
    }
  });
}

export default async function StudentPage({
  searchParams,
  params
}: {
  searchParams: {
    attendanceTokenId: string;
  };
  params: { organizationCode: string; courseCode: string };
}) {
  const serverSession = await getServerSession();

  const email: string | null = serverSession?.user?.email || null;
  const attendanceTokenId = searchParams.attendanceTokenId;

  try {
    if (!attendanceTokenId) {
      return <StudentPageBoard />;
    }

    if (!email) {
      return <MarkAttendanceError message="No Valid Email" />;
    }

    const tokenRow = await findAttendanceToken(attendanceTokenId);

    if (!tokenRow) {
      return <MarkAttendanceError message="Invalid Attendance Token" />;
    }

    const lectureId = tokenRow.lectureId;

    const courseId = await findCourseId(tokenRow.lectureId);

    if (!courseId) {
      return <MarkAttendanceError message="Missing Course ID" />;
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

    if (!courseMember) {
      return (
        <MarkAttendanceError message="You are not enrolled in this course." />
      );
    }

    if (courseMember?.role !== zCourseRoles.enum.student) {
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

    const ProfessorGeolocationId = tokenRow.ProfessorLectureGeolocationId;
    const studentLatitude = tokenRow.attendanceStudentLatitude;
    const studentLongitude = tokenRow.attendanceStudentLongtitude;

    if (!ProfessorGeolocationId) {
      console.log('No geolocation included');
    }

    if (ProfessorGeolocationId) {
      console.log('Entered with Geolocation ID');
      if (!studentLatitude || !studentLongitude) {
        console.log('Create Entry without Location');

        if (existingAttendanceEntry) {
          attendanceEntry = await updateAttendanceEntryWithoutStudentLocation(
            existingAttendanceEntry.id,
            ProfessorGeolocationId
          );
        } else {
          attendanceEntry = await createAttendanceEntryWithoutStudentLocation(
            lectureId,
            courseMemberId,
            ProfessorGeolocationId
          );
        }
      }

      if (studentLatitude && studentLongitude) {
        if (existingAttendanceEntry) {
          attendanceEntry = await updateAttendanceEntryWithLocation(
            existingAttendanceEntry.id,
            ProfessorGeolocationId,
            studentLatitude,
            studentLongitude
          );
        } else {
          attendanceEntry = await createAttendanceEntryWithLocation(
            lectureId,
            courseMemberId,
            ProfessorGeolocationId,
            studentLatitude,
            studentLongitude
          );
        }
      }
    }

    if (!ProfessorGeolocationId) {
      if (existingAttendanceEntry) {
        attendanceEntry = await updateAttendanceEntry(
          existingAttendanceEntry.id
        );
      } else {
        attendanceEntry = await createAttendanceEntry(
          lectureId,
          courseMemberId
        );
      }
    }

    await deleteAttendanceToken(attendanceTokenId);

    if (!attendanceEntry) {
      return (
        <MarkAttendanceError message="Unexpected Error: No Attendance was created for this submission." />
      );
    }

    return (
      <div>
        <StudentPageBoard
          dateMarked={attendanceEntry.dateMarked}
          newAttendanceEntry={attendanceEntry}
        />
      </div>
    );
  } catch (error) {
    const ErrorType = error as Error;
    return <MarkAttendanceError message={ErrorType.message} />;
  }
}
