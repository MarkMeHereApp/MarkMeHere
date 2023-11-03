import prisma from '@/prisma';
import { redirect } from 'next/navigation';
import CreateNewSchool from './components/create-new-organization';
export default async function HomePage() {
  const organization = await prisma.organization.findFirst({});

  if (organization) {
    throw new Error(
      'You already have an organization. You cannot create another organization at this current time.'
    );
  }

  return <CreateNewSchool />;
}
