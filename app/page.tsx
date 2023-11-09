import prisma from '@/prisma';
import { redirect } from 'next/navigation';
export default async function HomePage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE) {
    redirect(`/landing-page`);
  }

  const organization = await prisma.organization.findFirst({});

  if (organization) {
    redirect(`/${organization.uniqueCode}`);
  }

  redirect(`/create-organization`);
}
