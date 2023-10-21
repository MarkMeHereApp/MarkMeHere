/* -------- Only Professors or TA's can access these routes -------- */

import { elevatedCourseMemberCourseProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';


export const zCreateQRCode = z.object({
  secondsToExpireNewCode: z.number(),
  lectureId: z.string(),
  courseId: z.string(),
  professorLectureGeolocationId: z.string()
});

export const qrRouter = router({
  CreateNewQRCode: elevatedCourseMemberCourseProcedure
    .input(zCreateQRCode)
    .mutation(async ({ input }) => {
      try {
        let newCode: string | null = null;
        for (let i = 0; i < 10; i++) {
          newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

          const existingCode = await prisma.qrcode.findUnique({
            where: {
              code: newCode
            }
          });

          if (existingCode === null) {
            break;
          }
        }

        if (newCode === null) {
          throw new Error('Could not create a duplicate QR code.');
        }

        const lectureId = input.lectureId;
        const courseId = input.courseId;
        const professorLectureGeolocationId = input.professorLectureGeolocationId;
        console.log(professorLectureGeolocationId)
        
        
        if(professorLectureGeolocationId){
          const newExpiry = new Date();
          newExpiry.setSeconds(
          newExpiry.getSeconds() + input.secondsToExpireNewCode
          );

          try {
            const returnCode = await prisma.qrcode.create({
              data: {
                code: newCode,
                lectureId: lectureId,
                courseId: courseId,
                expiresAt: newExpiry,
                ProfessorLectureGeolocationId: professorLectureGeolocationId
              }
            });

            await prisma.qrcode.deleteMany({
              where: {
                expiresAt: {
                  lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
                }
              }
            });

            return { success: true, qrCode: returnCode };
          } catch (error) {
            throw error;
          }
        }

        else{
          const newExpiry = new Date();
          newExpiry.setSeconds(
            newExpiry.getSeconds() + input.secondsToExpireNewCode
          );

          try {
            const returnCode = await prisma.qrcode.create({
              data: {
                code: newCode,
                lectureId: lectureId,
                courseId: courseId,
                expiresAt: newExpiry, 
              }
            });

            await prisma.qrcode.deleteMany({
              where: {
                expiresAt: {
                  lte: new Date(new Date().getTime() - 15 * 1000) // 15 seconds ago
                }
              }
            });

            return { success: true, qrCode: returnCode };
          } catch (error) {
            throw error;
          }
        }        
      } catch (error) {
        throw error;
      }
    })
});
