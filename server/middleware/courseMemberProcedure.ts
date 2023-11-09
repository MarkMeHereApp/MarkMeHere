import { trpc } from '../trpc';
import { generateTypedError } from '../errorTypes';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { findCourseMember } from '../utils/courseMemberHelpers';

/* -------- Checks if current user is enrolled in the course -------- */

const courseInput = z.object({
  courseId: z.string()
});

const isCourseMember = trpc.middleware(async ({ next, ctx, rawInput }) => {
  const result = courseInput.safeParse(rawInput);
  const email = ctx.session?.email;

  if (!result.success)
    throw generateTypedError(
      new TRPCError({
        code: 'PARSE_ERROR',
        message: 'TRPC Middleware: isCourseMember requires a valid courseId'
      })
    );

  if (!email)
    throw generateTypedError(
      new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'TRPC Middleware: User does not have a valid JWT'
      })
    );

  const courseMember = await findCourseMember(email, result.data.courseId);

  if (!courseMember)
    throw generateTypedError(
      new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'TRPC Middleware: User is not enrolled in the selected course'
      })
    );

  return next();
});

/* Checks course enrollment using courseId */
const courseMemberProcedure = trpc.procedure.use(isCourseMember);
export default courseMemberProcedure;
