import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { Context } from './context';

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

// const middleware = trpc.middleware;

// const isProfessor = middleware(async (opts) => {
//   const { ctx } = opts;
//   if (!ctx.user?.isAdmin) {
//     throw new TRPCError({ code: 'UNAUTHORIZED' });
//   }
//   return opts.next({
//     ctx: {
//       user: ctx.user,
//     },
//   });
// });

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
