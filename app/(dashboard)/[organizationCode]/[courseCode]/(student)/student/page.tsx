import StudentPageBoard from './StudentPageBoard';
import { AttendanceEntry } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { zAttendanceTokenType, zCourseRoles } from '@/types/sharedZodTypes';
import MarkAttendanceError from '../markAttendance/components/mark-attendance-error';
import { formatString } from '@/utils/globalFunctions';
import { attendanceTokenExpirationTime } from '@/utils/globalVariables';
import {
  createAttendanceEntry,
  createAttendanceEntryWithLocation,
  createAttendanceEntryWithoutStudentLocation,
  deleteAttendanceToken,
  findAttendanceEntry,
  findAttendanceToken,
  findCourseId,
  findCourseMember,
  updateAttendanceEntry,
  updateAttendanceEntryWithLocation,
  updateAttendanceEntryWithoutStudentLocation
} from './utils/studentHelpers';

export default async function StudentPage({
  searchParams
}: {
  searchParams: {
    attendanceTokenId: string;
  };
}) {
  const serverSession = await getServerSession();

  const email: string | null = serverSession?.user?.email || null;
  const attendanceTokenId = searchParams.attendanceTokenId;

  console.log(attendanceTokenId + 'Got to student page');

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

    const {
      professorLectureGeolocationId,
      attendanceStudentLatitude,
      attendanceStudentLongitude
    } = tokenRow;

    if (!professorLectureGeolocationId) {
      console.log('No geolocation included');
    }

    if (professorLectureGeolocationId) {
      console.log('Entered with Geolocation ID');
      if (!attendanceStudentLatitude || !attendanceStudentLongitude) {
        console.log('Create Entry without Location');

        if (existingAttendanceEntry) {
          attendanceEntry = await updateAttendanceEntryWithoutStudentLocation(
            existingAttendanceEntry.id,
            professorLectureGeolocationId
          );
        } else {
          attendanceEntry = await createAttendanceEntryWithoutStudentLocation(
            lectureId,
            courseMemberId,
            professorLectureGeolocationId
          );
        }
      }

      if (attendanceStudentLatitude && attendanceStudentLongitude) {
        if (existingAttendanceEntry) {
          attendanceEntry = await updateAttendanceEntryWithLocation(
            existingAttendanceEntry.id,
            professorLectureGeolocationId,
            attendanceStudentLatitude,
            attendanceStudentLongitude
          );
        } else {
          attendanceEntry = await createAttendanceEntryWithLocation(
            lectureId,
            courseMemberId,
            professorLectureGeolocationId,
            attendanceStudentLatitude,
            attendanceStudentLongitude
          );
        }
      }
    }

    if (!professorLectureGeolocationId) {
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
        <StudentPageBoard dateMarked={attendanceEntry.dateMarked} />
      </div>
    );
  } catch (error) {
    const ErrorType = error as Error;
    return <MarkAttendanceError message={ErrorType.message} />;
  }
}
