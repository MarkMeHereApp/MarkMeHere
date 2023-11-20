'use server';

import 'server-only';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { ensureAndGetNextAuthSession } from '../../auth';

export const addGeolocationToAttendanceToken = async ({
  attendanceTokenId,
  latitude,
  longitude
}: {
  attendanceTokenId: string;
  latitude: number;
  longitude: number;
}) => {
  try {
    const session = await ensureAndGetNextAuthSession();

    const attendanceToken = await prisma.attendanceToken.update({
      where: {
        id: attendanceTokenId
      },
      data: {
        attendanceStudentLatitude: latitude,
        attendanceStudentLongtitude: longitude
      }
    });

    return attendanceToken;
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
