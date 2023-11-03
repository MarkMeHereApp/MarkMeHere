import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import LandingPage from './(landingPage)/components/landing-page';
export default async function HomePage() {
  if (process.env.DEMO_MODE) {
    redirect(`/landing-page`);
  }

  const organization = await prisma.organization.findFirst({});

  if (organization) {
    redirect(`/${organization.uniqueCode}`);
  }

  redirect(`/create-school`);
}
