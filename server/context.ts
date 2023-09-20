import type { inferAsyncReturnType } from '@trpc/server';
// import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import type { FetchHandlerRequestOptions } from '@trpc/server/adapters/fetch';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  //We may have to manually decode the jwt ourself here using request headers
  //This also adds another problem if we want to use location services
  //Although it is possible we can do all of the geolocation stuff
  //in next middleware instead because it has access to nextresponse object

  /* 
    Here we need to cast our request as NextRequest type for the getToken function
    The function still runs fine so we have all of the fields we need in the request object.
    We use the type assertion to tell typescript to shut up about it until trpc creates an
    adequate adapter for nextjs13 app directory that uses type NextRequest

    KEEP AN EYE ON THIS FOR FUTURE JWT ERRORS
    */
  const session = await getToken({ req: opts.req as NextRequest });

  console.log('SESSION: ', session);

  return {
    req: opts.req
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
