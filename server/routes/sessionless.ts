import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';

import { TRPCError } from '@trpc/server';
import { v4 as uuidv4 } from 'uuid';

const zCreateOrganization = z.object({
  name: z.string(),
  uniqueCode: z.string()
});

export const zActiveCode = z.object({
  code: z.string()
});

export const sessionlessRouter = router({
  createOrganization: publicProcedure
    .input(zCreateOrganization)
    .mutation(async (requestData) => {
      try {
        const existingOrg = await prisma.organization.findFirst();

        if (existingOrg) {
          throw generateTypedError(
            new TRPCError({
              code: 'UNAUTHORIZED',
              message:
                'An Organization already exists in the database. We do not support adding more than one organization at this time.'
            })
          );
        }

        return await prisma.organization.create({
          data: {
            name: requestData.input.name,
            uniqueCode: requestData.input.uniqueCode.toLowerCase(),
            hashEmails: false
          }
        });
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  ValidateAndCreateAttendanceToken: publicProcedure
    .input(zActiveCode)
    .mutation(async ({ input }) => {
      try {

        const qrResult = await prisma.qrcode.findUnique({
          where: {
            code: input.code
          },
          include: {
            course: true
          }
        });
        if (qrResult === null) {
          return { success: false };
        }

        const { id } = await prisma.attendanceToken.create({
          data: {
            token: uuidv4(),
            lectureId: qrResult.lectureId,
            ProfessorLectureGeolocationId:
              qrResult.ProfessorLectureGeolocationId
          }
        });

        return {
          success: true,
          token: id,
          location: qrResult.ProfessorLectureGeolocationId,
          course: qrResult.course
        };
      } catch (error) {
        throw error;
      }
    })
});

export type SessionlessRouter = typeof sessionlessRouter;
