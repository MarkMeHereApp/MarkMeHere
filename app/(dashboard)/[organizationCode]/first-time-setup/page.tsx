import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/prisma';
import { FirstTimeSteps } from './[step]/components/first-time-steps';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('No Valid Session Found');
  }
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    }
  });

  if (user) {
    redirect(
      `/${params.organizationCode}/first-time-setup/${(
        FirstTimeSteps.length - 1
      ).toString()}`
    );
  }

  redirect(`/${params.organizationCode}/first-time-setup/0`);
}
