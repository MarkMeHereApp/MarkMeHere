import prisma from '@/prisma';
import { FirstTimeSteps, StepSkeleton } from './components/first-time-steps';
import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import type { NextAuthOptions } from 'next-auth';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { revalidatePath } from 'next/cache';

export default async function Step({
  params
}: {
  params: { organizationCode: string; step: string };
}) {
  const GetStepFunction = async () => {
    revalidatePath('/', 'layout')
    revalidatePath('/', 'page')


    const authOptions = await getAuthOptions();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error('No session found');
    }

    if (!(session.user.role === zSiteRoles.enum.admin)) {
      throw new Error('You are not authorized to visit this page!');
    }

    const StepFunction = FirstTimeSteps[Number(params.step)];
    if (!StepFunction) {
      throw new Error('No Step Found');
    }
    return (
      <>
        <StepFunction
          organizationCode={params.organizationCode}
          currentStep={Number(params.step)}
        />
      </>
    );
  };

  return (
    <Suspense fallback={<StepSkeleton />}>
      <GetStepFunction />
    </Suspense>
  );
}
