import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const trpc = initTRPC.create({
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

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
