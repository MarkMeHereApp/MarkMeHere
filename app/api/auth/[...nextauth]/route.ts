import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { getAuthOptions } from './options';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = await getAuthOptions();
  return NextAuth(req, res, options);
};

export { handler as GET, handler as POST };
