import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

export const trpc = initTRPC.create({
  transformer: superjson
});

export const router = trpc.router;
export const publicProcedure = trpc.procedure;
