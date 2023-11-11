import prisma from '@/prisma';
import { kv as redis } from '@vercel/kv';
import {
  zAttendanceStatus,
  zAttendanceTokenType,
  zQrCodeType
} from '@/types/sharedZodTypes';
import { redisAttendanceKey, redisQrCodeKey } from '@/utils/globalFunctions';
import { v4 as uuidv4 } from 'uuid';

export async function findAttendanceToken(
  attendanceTokenId: string
): Promise<zAttendanceTokenType | null> {
  const attendanceTokenKey = redisAttendanceKey(attendanceTokenId);
  return await redis.hgetall(attendanceTokenKey);
}

export async function deleteAttendanceToken(attendanceTokenId: string) {
  return await redis.del(redisAttendanceKey(attendanceTokenId));
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

export async function validateAndCreateToken(qrCode: string) {
  try {
    const expirationTime = 600;
    const qrResult: zQrCodeType | null = await redis.hgetall(
      redisQrCodeKey(qrCode)
    );

    if (!qrResult) return { success: false };

    const course = await prisma.course.findUnique({
      where: {
        id: qrResult.courseId
      }
    });

    if (!course) return { success: false };

    const attendanceToken = uuidv4();
    const attendanceTokenId = uuidv4();
    const attendanceTokenKey = 'attendanceToken:' + attendanceTokenId;

    const attendanceTokenObj: zAttendanceTokenType = {
      token: attendanceToken,
      courseId: qrResult.courseId,
      lectureId: qrResult.lectureId,
      professorLectureGeolocationId: qrResult.professorLectureGeolocationId,
      attendanceStudentLatitude: null,
      attendanceStudentLongitude: null,
      createdAt: new Date()
    };

    await redis
      .multi()
      .hset(redisAttendanceKey(attendanceTokenId), attendanceTokenObj)
      .expire(attendanceTokenKey, 300)
      .exec();

    return {
      success: true,
      token: attendanceTokenId,
      location: qrResult.professorLectureGeolocationId,
      organizationCode: course.organizationCode,
      courseCode: course.courseCode
    };
  } catch (error) {
    throw error;
  }
}
// function uuidv4() {
//   throw new Error('Function not implemented.');
// }
