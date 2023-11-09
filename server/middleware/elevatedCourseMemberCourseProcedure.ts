import { z } from 'zod';
import prisma from '@/prisma';
import { trpc } from '../trpc';
import { generateTypedError } from '../errorTypes';
import { TRPCError } from '@trpc/server';
import { zCourseRoles, zSiteRoles } from '@/types/sharedZodTypes';

const courseInput = z.object({
  courseId: z.string()
});

/* 
This middleware is meant for routes that use a courseId
1. Look up the courseMember using courseId. Verify they are a teacher
2. If the courseMember is found the user has access.
*/
const isElevatedCourseMemberCourse = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;
    const result = courseInput.safeParse(rawInput);
    const role = zSiteRoles.safeParse(ctx.session?.role);

    if (!role.success)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'TRPC Middleware: User does not have a valid JWT'
        })
      );

    if (role.data === zSiteRoles.enum.admin) return next();

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
          code: 'PARSE_ERROR',
          message:
            'TRPC Middleware: isElevatedCourseMemberCourse requires a valid courseId'
        })
      );

    //Find the first courseMember who is a teacher
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: result.data.courseId,
        email: email,
        role: zCourseRoles.enum.teacher
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
const elevatedCourseMemberCourseProcedure = trpc.procedure.use(
  isElevatedCourseMemberCourse
);
export default elevatedCourseMemberCourseProcedure;
