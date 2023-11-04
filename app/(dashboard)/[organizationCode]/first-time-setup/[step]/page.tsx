import prisma from '@/prisma';
import { steps } from './components/steps';

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

  const stepFunction = steps[Number(params.step)];
  if (!stepFunction) {
    throw new Error('No Step Found');
  }
  return stepFunction({ organization });
}
