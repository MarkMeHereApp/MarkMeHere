import prisma from '@/prisma';
import { kv as redis } from '@vercel/kv';
import {
  zAttendanceStatus,
  zAttendanceStatusType,
  zAttendanceTokenType
} from '@/types/sharedZodTypes';
import { redisAttendanceKey } from '@/utils/globalFunctions';

export async function findAttendanceToken(
  attendanceTokenId: string
): Promise<zAttendanceTokenType | null> {
  const attendanceTokenKey = redisAttendanceKey(attendanceTokenId)
  return await redis.hgetall(attendanceTokenKey);
}

export async function findCourseId(lectureId: string) {
  const lecture = await prisma.lecture.findFirst({
    where: {
      id: lectureId
    }
  });
  return lecture?.courseId;
}

export async function findCourseMember(courseId: string, email: string) {
  return await prisma.courseMember.findFirst({
    where: {
      courseId: courseId,
      email: email
    }
  });
}

export async function deleteAttendanceToken(attendanceTokenId: string) {
  return await prisma.attendanceToken.delete({
    where: {
      id: attendanceTokenId
    }
  });
}

export async function findAttendanceEntry(
  lectureId: string,
  courseMemberId: string
) {
  return await prisma.attendanceEntry.findFirst({
    where: {
      lectureId: lectureId,
      courseMemberId: courseMemberId
    }
  });
}

export async function updateAttendanceEntry(id: string) {
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

export async function createAttendanceEntry(
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

export async function createAttendanceEntryWithLocation(
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
      professorLectureGeolocationId: ProfessorLectureGeolocationId,
      studentLatitude: studentLatitude,
      studentLongtitude: studentLongitude
    }
  });
}

export async function updateAttendanceEntryWithLocation(
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
      professorLectureGeolocationId: ProfessorLectureGeolocationId,
      studentLatitude: studentLatitude,
      studentLongtitude: studentLongitude
    }
  });
}

export async function createAttendanceEntryWithoutStudentLocation(
  lectureId: string,
  courseMemberId: string,
  ProfessorLectureGeolocationId: string
) {
  return await prisma.attendanceEntry.create({
    data: {
      lectureId: lectureId,
      courseMemberId: courseMemberId,
      status: zAttendanceStatus.enum.here,
      professorLectureGeolocationId: ProfessorLectureGeolocationId
    }
  });
}

export async function updateAttendanceEntryWithoutStudentLocation(
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
      professorLectureGeolocationId: ProfessorLectureGeolocationId
    }
  });
}
