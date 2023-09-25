import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Context } from './context';
import z from 'zod';
import { TRPCError } from '@trpc/server';
import { generateTypedError } from './errorTypes';
import prisma from '@/prisma';

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

/*
So im thinking we will need a couple of middleware functions to handle certain routes
isProfessorLecture, isProfessorCourse, isProfessor&TALecture, isProfessor&TACourse

I can use one middleware function to handle both course and lecture input however
this introduces the case of having undefined values in the data object returned from parsing
The middleware function will also be extremely large. For now they will be separated
*/

const lectureInput = z.object({
  lectureId: z.string()
});

const courseInput = z.object({
  courseId: z.string()
});

/* 
This middleware is meant for routes that use a lectureId
1. Look up the lecture using lectureId.
2. Look up the courseMember using courseId and user email. Verify they are either
a professor or TA.
3. If the courseMember is found the user has access.
*/
const isProfessorOrTaLecture = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;
    const result = lectureInput.safeParse(rawInput);

    if (!email)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have a valid JWT'
        })
      );

    if (!result.success)
      throw generateTypedError(
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid URL parameters'
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
          message: 'Lecture Not found'
        })
      );

    //Find the first courseMember who is either a professor or TA
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: lecture.courseId,
        email: email,
        OR: [{ role: 'professor' }, { role: 'TA' }]
      }
    });

    if (!courseMember)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message:
            'User either does not exist in course or does not have elevated priveleges'
        })
      );

    return next();
  }
);

const isProfessorOrTaCourse = trpc.middleware(
  async ({ next, ctx, rawInput }) => {
    const email = ctx.session?.email;
    const result = courseInput.safeParse(rawInput);

    if (!email)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have a valid JWT'
        })
      );

    if (!result.success)
      throw generateTypedError(
        new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid URL parameters'
        })
      );

    //Find the first courseMember who is either a professor or TA
    const courseMember = await prisma.courseMember.findFirst({
      where: {
        courseId: result.data.courseId,
        email: email,
        OR: [{ role: 'professor' }, { role: 'TA' }]
      }
    });

    if (!courseMember)
      throw generateTypedError(
        new TRPCError({
          code: 'UNAUTHORIZED',
          message:
            'User either does not exist in course or does not have elevated priveleges'
        })
      );

    return next();
  }
);

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const professorOrTaLectureProcedure = trpc.procedure.use(
  isProfessorOrTaLecture
);
export const professorOrTaCourseProcedure = trpc.procedure.use(
  isProfessorOrTaCourse
);
