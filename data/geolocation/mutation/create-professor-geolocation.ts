'use server';

import 'server-only';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { ensureAndGetNextAuthSession } from '../../auth';

import z from 'zod';

export const zCreateProfessorLectureGeolocation = z.object({
  lectureLatitude: z.number(),
  lectureLongitude: z.number(),
  lectureId: z.string(),
  courseMemberId: z.string(),
  lectureRange: z.number()
});

export const createProfessorGeolocation = async (
  requestData: z.infer<typeof zCreateProfessorLectureGeolocation>
) => {
  try {
    const resGeolocation = await prisma.professorLectureGeolocation.create({
      data: {
        ...requestData
      }
    });

    return { success: true, id: resGeolocation.id };
  } catch (error) {
    throw error;
  }
};
