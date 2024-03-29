import type { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import prisma from '@/prisma';
import { defaultSiteSettings } from '@/utils/globalVariables';

/* 
  Here we need to cast our request as NextRequest type for the getToken function
  The function still runs fine because we have all of the fields we need in the request object.
  We use the type assertion to tell typescript to shut up about it until trpc creates an
  adequate adapter for nextjs13 app directory that uses type NextRequest

  KEEP AN EYE ON THIS FOR FUTURE JWT ERRORS
  */

/*
  @TODO: The site settings shouldn't be here.
  */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await getToken({ req: opts.req as NextRequest });
  const siteSettingsDB = await prisma.organization.findFirst();

  if (siteSettingsDB) {
    return {
      session,
      settings: siteSettingsDB
    };
  }

  return {
    session,
    settings: defaultSiteSettings
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
