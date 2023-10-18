import type { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import prisma from '@/prisma';

/* 
  Here we need to cast our request as NextRequest type for the getToken function
  The function still runs fine because we have all of the fields we need in the request object.
  We use the type assertion to tell typescript to shut up about it until trpc creates an
  adequate adapter for nextjs13 app directory that uses type NextRequest

  KEEP AN EYE ON THIS FOR FUTURE JWT ERRORS
  */

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getToken({ req: opts.req as NextRequest });
  const settings = await getGlobalSiteSettings_Server({
    googleMapsApiKey: true,
    hashEmails: true
  });

  return {
    session,
    settings
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
