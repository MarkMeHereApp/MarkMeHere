import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { elevatedCourseMemberLectureProcedure } from '../trpc';

export const zCreateProfessorLectureGeolocation = z.object({
    lectureLatitude: z.number(),
    lectureLongitude: z.number(),
    lectureId: z.string(),
    courseMemberId: z.string(),
  });

export const zCreateStudentGeolocation = z.object({
    lectureLatitude: z.number(),
    lectureLongitude: z.number(),
    lectureId: z.string(),
    attendanceTokenId: z.string()
  });

export const geolocationRouter = router({
    CreateProfessorLectureGeolocation: elevatedCourseMemberLectureProcedure
    .input(zCreateProfessorLectureGeolocation)
    .mutation(async (requestData) => {
        console.log('got here')
        try{
            const resGeolocation = await prisma.professorLectureGeolocation.create({
                data:{
                    ...requestData.input
                }
            });


        return {success: true, id: resGeolocation.id}
        }catch(error){
            throw error
        }
    })

    
});

export type GeolocationRouter = typeof geolocationRouter;
