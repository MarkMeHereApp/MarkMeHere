'use server';

import 'server-only';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { getOrganization } from '../organization/organization';
import { bHasCoursePermission, ensureAndGetNextAuthSession } from '../auth';
import { distanceBetween2Points } from '@/utils/globalFunctions';

export const getProfessorGeolocationInfo = async ({
  attendanceTokenId,
  studentLatitude,
  studentLongitude
}: {
  attendanceTokenId: string;
  studentLatitude: number;
  studentLongitude: number;
}) => {
  try {
    const session = await ensureAndGetNextAuthSession();

    const attendanceToken = await prisma.attendanceToken.findFirst({
      where: {
        id: attendanceTokenId
      },
      include: {
        ProfessorLectureGeolocation: true
      }
    });

    if (!attendanceToken?.ProfessorLectureGeolocation) {
      throw new Error('Geolocation not found!');
    }

    const calculateDistance = distanceBetween2Points(
      attendanceToken.ProfessorLectureGeolocation.lectureLatitude,
      attendanceToken.ProfessorLectureGeolocation.lectureLongitude,
      studentLatitude,
      studentLongitude
    );

    return { attendanceToken: attendanceToken, distance: calculateDistance };
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
