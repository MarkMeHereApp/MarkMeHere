import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import CreateNewSchool from './components/create-new-school';
export default async function HomePage() {
  const organization = await prisma.organization.findFirst({});

  if (organization) {
    redirect(`/${organization.uniqueCode}`);
  }

  return <CreateNewSchool />;
}
