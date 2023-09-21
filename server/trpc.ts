import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Context } from './context';
import z from 'zod';
import { TRPCError } from '@trpc/server';
import { generateTypedError } from './errorTypes';

//Lets make middleware functions as such:

//hasCourseAccess ,these routes use courseIds to change the database so we will
//authenticate the user against the courseId

//hasLectureAccess these routes use lectureIds to change the database so we will
//authenticate the user against the lectureId

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
this introduces the case of having undefined values in the data object returned form parsing
The middleware function will also be extremely large. For now they will be separated
*/

const professorLectureInput = z.object({
  lectureId: z.string().optional(),
  courseId: z.string().optional()
});

const isProfessorLecture = trpc.middleware(({ next, rawInput, ctx }) => {
  const result = professorLectureInput.safeParse(rawInput);
  if (!result)
    throw generateTypedError(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid URL parameters'
      })
    );
  //We have context
  //Now we need to grab the courseId and/or lectureID from endpoint somehow
  console.log('INPUT HERE');
  console.log(result);
  //console.log("CONTEXT HERE")
  //console.log(ctx)

  return next({
    ctx: {
      // Infers the `session` as non-nullable
      ctx: ctx
    }
  });
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const professorProcedure = trpc.procedure.use(isProfessorLecture);
