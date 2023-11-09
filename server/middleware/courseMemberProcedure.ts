import { trpc } from '../trpc';
import { generateTypedError } from '../errorTypes';
import { TRPCError } from '@trpc/server';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { z } from 'zod';

/* -------- Checks if current user is enrolled in the course -------- */

const courseInput = z.object({
    courseId: z.string()
  });

const isCourseMember = trpc.middleware(async ({ next, ctx, rawInput }) => {
  const courseId = courseInput.safeParse(rawInput);

  if (!courseId)
    throw generateTypedError(
      new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'TRPC Middleware: User does not have a valid JWT'
      })
    );

//   if (role.data !== zSiteRoles.enum.admin)
//     throw generateTypedError(
//       new TRPCError({
//         code: 'UNAUTHORIZED',
//         message: 'TRPC Middleware: User does not have admin privileges'
//       })
//     );

  return next();
});

/* Checks admin privileges using JWT */
const courseMemberProcedure = trpc.procedure.use(isCourseMember);
export default courseMemberProcedure;
