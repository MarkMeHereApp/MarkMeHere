import { redirect } from 'next/navigation';

export default async function Page({
  params
}: {
  params: { organizationCode: string };
}) {
  redirect(`/${params.organizationCode}/first-time-setup/0`);
}
