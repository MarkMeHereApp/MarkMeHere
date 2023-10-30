import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import LandingPage from './components/landing-page';
export default async function HomePage() {
  if (process.env.DEMO_MODE) {
    // @ts-ignore
    return <LandingPage />;
  }

  const organization = await prisma.organization.findFirst({});

  if (organization) {
    redirect(`/${organization.uniqueCode}`);
  }

  redirect(`/create-school`);
}
