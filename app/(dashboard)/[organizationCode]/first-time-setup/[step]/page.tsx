import prisma from '@/prisma';
import { FirstTimeSteps, StepSkeleton } from './components/first-time-steps';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import type { NextAuthOptions } from 'next-auth';

export default async function Step({
  params
}: {
  params: { organizationCode: string; step: string };
}) {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('No session found');
  }

  const organization = await prisma.organization.findFirst({
    where: { uniqueCode: params.organizationCode }
  });

  if (!organization) {
    throw new Error('No organization found!');
  }

  const StepFunction = FirstTimeSteps[Number(params.step)];
  if (!StepFunction) {
    throw new Error('No Step Found');
  }
  return (
    <Suspense fallback={<StepSkeleton />}>
      {JSON.stringify(session)}
      <StepFunction
        organizationCode={params.organizationCode}
        currentStep={Number(params.step)}
      />
    </Suspense>
  );
}
