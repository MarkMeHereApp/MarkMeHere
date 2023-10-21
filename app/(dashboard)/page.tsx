import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';
import { firaSansFont } from '@/utils/fonts';
import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Continue from '@/components/general/continue';
import InitiallyCreateSchool from './create-new-school';
export default async function HomePage() {
  const school = await prisma.globalSiteSettings.findFirst({});

  if (school) {
    redirect(`/${school.schoolAbbreviation}`);
  }

  return <InitiallyCreateSchool />;
}
