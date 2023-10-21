import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import InitiallyCreateSchool from './create-new-school';
export default async function HomePage() {
  const school = await prisma.globalSiteSettings.findFirst({});

  if (school) {
    redirect(`/${school.schoolAbbreviation}`);
  }

  return <InitiallyCreateSchool />;
}
