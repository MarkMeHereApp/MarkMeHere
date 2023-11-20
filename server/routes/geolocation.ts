import { router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import elevatedCourseMemberLectureProcedure from '../middleware/elevatedCourseMemberLectureProcedure';

export const zCreateProfessorLectureGeolocation = z.object({
  lectureLatitude: z.number(),
  lectureLongitude: z.number(),
  lectureId: z.string(),
  courseMemberId: z.string(),
  lectureRange: z.number()
});

export const geolocationRouter = router({
  CreateProfessorLectureGeolocation: elevatedCourseMemberLectureProcedure
    .input(zCreateProfessorLectureGeolocation)
    .mutation(async (requestData) => {
      try {
        const resGeolocation = await prisma.professorLectureGeolocation.create({
          data: {
            ...requestData.input
          }
        });

        return { success: true, id: resGeolocation.id };
      } catch (error) {
        throw error;
      }
    })
});

export type GeolocationRouter = typeof geolocationRouter;
