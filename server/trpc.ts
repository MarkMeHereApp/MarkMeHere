import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { Prisma } from '@prisma/client';

export const t = initTRPC.create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    const prismaError = error.cause as Prisma.PrismaClientKnownRequestError;
    return {
      ...shape,
      data: {
        ...shape.data,
        // Hard coded for now, but we can add more error codes as we need them
        toastError: prismaError && prismaError.code === 'P2002' ? true : false
      }
    };
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
