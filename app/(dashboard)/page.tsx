import MarkMeHereClassAnimation from '@/components/mark-me-here/MarkMeHereClassAnimation';
import { firaSansFont } from '@/utils/fonts';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const school = await prisma.globalSiteSettings.findFirst({});

  if (school) {
    redirect(`/${school.schoolAbbreviation}`);
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col items-center">
        <MarkMeHereClassAnimation />
        <span className={firaSansFont.className}>
          <h2 className="text-3xl font-bold">Mark Me Here!</h2>
        </span>
      </div>
    </div>
  );
}
