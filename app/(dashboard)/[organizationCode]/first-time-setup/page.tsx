import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  redirect(`/${params.organizationCode}/first-time-setup/1`);
}
