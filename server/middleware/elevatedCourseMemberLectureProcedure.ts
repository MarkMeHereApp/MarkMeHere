import { z } from 'zod';
import prisma from '@/prisma';
import { trpc } from '../trpc';
import { generateTypedError } from '../errorTypes';
import { TRPCError } from '@trpc/server';
import { zCourseRoles } from '@/types/sharedZodTypes';

/* 
This middleware is meant for routes that use a lectureId
1. Look up the lecture using lectureId.
2. Look up the courseMember using courseId and user email. Verify they are either
a teacher or TA.
3. If the courseMember is found the user has access.
*/

const lectureInput = z.object({
  lectureId: z.string()
});

const isElevatedCourseMemberLecture = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;
    const result = lectureInput.safeParse(rawInput);

    if (!email)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'TRPC Middleware: User does not have a valid JWT'
        })
      );

    if (!result.success)
      throw generateTypedError(
        new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'TRPC Middleware: isElevatedCourseMemberLecture requires a valid lectureId'
        })
      );

    const lecture = await prisma.lecture.findFirst({
      where: {
        id: result.data.lectureId
      }
    });

    if (!lecture)
      throw generateTypedError(
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TRPC Middleware: Lecture Not found'
        })
      );

    //Find the first courseMember who is either a teacher or TA
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: lecture.courseId,
        email: email,
        OR: [
          { role: zCourseRoles.enum.teacher },
          { role: zCourseRoles.enum.ta }
        ]
      }
    });

    if (!courseMember)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message:
            'TRPC Middleware: User either does not exist in course or does not have elevated priveleges'
        })
      );

    return next();
  }
);

/* -------- Checks privileges using lectureId -------- */
const elevatedCourseMemberLectureProcedure = trpc.procedure.use(
  isElevatedCourseMemberLecture
);
export default elevatedCourseMemberLectureProcedure;
