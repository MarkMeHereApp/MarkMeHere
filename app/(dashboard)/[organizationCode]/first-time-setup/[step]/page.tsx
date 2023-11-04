import prisma from '@/prisma';
import { FirstTimeSteps } from './components/first-time-steps';

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

  const stepFunction = FirstTimeSteps[Number(params.step)];
  if (!stepFunction) {
    throw new Error('No Step Found');
  }
  return stepFunction({ organization });
}
