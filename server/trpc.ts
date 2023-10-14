import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Context } from './context';
import z from 'zod';
import { TRPCError } from '@trpc/server';
import { generateTypedError } from './errorTypes';
import prisma from '@/prisma';
import { zCourseRoles } from '@/types/sharedZodTypes';

export const trpc = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    const prismaError =
      error.cause instanceof Prisma.PrismaClientKnownRequestError;
    const zodError = error.cause instanceof ZodError;
    return {
      ...shape,
      data: {
        ...shape.data,
        // Hard coded for now, but we can add more error codes as we need them
        isZodError: zodError ? true : false,
        isUniqueConstraintError:
          prismaError && error.cause.code === 'P2002' ? true : false
      }
    };
  }
});

const lectureInput = z.object({
  lectureId: z.string()
});

const courseInput = z.object({
  courseId: z.string()
});

const courseMemberInput = z.object({
  courseMemberId: z.string()
});

/* 
This middleware is meant for routes that use a lectureId
1. Look up the lecture using lectureId.
2. Look up the courseMember using courseId and user email. Verify they are either
a teacher or TA.
3. If the courseMember is found the user has access.
*/
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

/* 
This middleware is meant for routes that use a courseId
1. Look up the courseMember using courseId. Verify they are either a teacher or ta
2. If the courseMember is found the user has access.
*/
const isElevatedCourseMemberCourse = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;
    const result = courseInput.safeParse(rawInput);

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
            'TRPC Middleware: isElevatedCourseMemberCourse requires a valid courseId'
        })
      );

    //Find the first courseMember who is either a teacher or TA
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: result.data.courseId,
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

export const router = trpc.router;
export const publicProcedure = trpc.procedure;

/* -------- Checks privileges using lectureId -------- */
export const elevatedCourseMemberLectureProcedure = trpc.procedure.use(
  isElevatedCourseMemberLecture
);
/* -------- Checks privileges using courseId -------- */
export const elevatedCourseMemberCourseProcedure = trpc.procedure.use(
  isElevatedCourseMemberCourse
);

/* -------- Checks privileges using courseId -------- */
export const elevatedCourseMemberForCourseMemberProcedure = trpc.procedure.use(
  isElevatedCourseMemberForCourseMember
);
