import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import InitiallyCreateSchool from './create-new-school';
export default async function HomePage() {
  const organization = await prisma.globalSiteSettings.findFirst({});

  if (organization) {
    redirect(`/${organization.uniqueCode}`);
  }

  return <InitiallyCreateSchool />;
}
