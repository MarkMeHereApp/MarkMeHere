import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { getAuthOptions } from './options';

// We have to make the req and res any (instead of NextApiRequest/NextApiResponse) because during next-build
// Next will try to run this route with NextRequest/RouteHandlerContext instead of NextApiRequest/NextApiResponse and fail.
const handler = async (req: any, res: any) => {
  const options = await getAuthOptions();
  return NextAuth(req, res, options);
};

export { handler as GET, handler as POST };
