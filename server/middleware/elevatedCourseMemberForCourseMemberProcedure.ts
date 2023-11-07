import { z } from 'zod';
import prisma from '@/prisma';
import { trpc } from '../trpc';
import { generateTypedError } from '../errorTypes';
import { TRPCError } from '@trpc/server';
import { zCourseRoles } from '@/types/sharedZodTypes';

const courseMemberInput = z.object({
  courseMemberId: z.string()
});

const isElevatedCourseMemberForCourseMember = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;

    const result = courseMemberInput.safeParse(rawInput);

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
            'TRPC Middleware: isElevatedCourseMemberForCourseMember requires a valid courseMemberId'
        })
      );

    const ctxCourseMembership = await prisma.courseMember.findFirst({
      where: {
        id: result.data.courseMemberId
      }
    });

    if (!ctxCourseMembership)
      throw generateTypedError(
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'TRPC Middleware: Could not find courseMember with id.'
        })
      );

    //Find the first courseMember who is either a professor or TA
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: ctxCourseMembership.courseId,
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

/* -------- Checks privileges using courseId -------- */
const elevatedCourseMemberForCourseMemberProcedure = trpc.procedure.use(
  isElevatedCourseMemberForCourseMember
);
export default elevatedCourseMemberForCourseMemberProcedure;
