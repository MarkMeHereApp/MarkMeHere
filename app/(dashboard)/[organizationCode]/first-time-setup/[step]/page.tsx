import prisma from '@/prisma';
import { FirstTimeSteps, StepSkeleton } from './components/first-time-steps';
import { Suspense } from 'react';

export default async function Step({
  params
}: {
  params: { organizationCode: string; step: string };
}) {
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
      <StepFunction
        organizationCode={params.organizationCode}
        currentStep={Number(params.step)}
      />
    </Suspense>
  );
}
