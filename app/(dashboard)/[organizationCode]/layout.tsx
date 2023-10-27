import { ThemeProvider } from './theme-provider';
import prisma from '@/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import OrganizationContextProvider from './context-organization';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { decrypt } from '@/utils/globalFunctions';

export default async function SchoolLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string };
}) {
  const session = await getServerSession();

  const email = session?.user?.email;

  if (!email) {
    throw new Error('No email found in session');
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email
    }
  });

  if (!user) {
    throw new Error('No user found');
  }

  const organization = await prisma.globalSiteSettings.findFirst({
    where: { uniqueCode: params.organizationCode }
  });

  if (organization?.googleMapsApiKey) {
    const key = organization.googleMapsApiKey;

    organization.googleMapsApiKey = '';

    if (user.role === zSiteRoles.enum.admin) {
      organization.googleMapsApiKey = decrypt(key);
    }

    if (
      user.role === zSiteRoles.enum.moderator &&
      organization.allowModeratorsToUseGoogleMaps
    ) {
      organization.googleMapsApiKey = decrypt(key);
    }

    if (
      user.role === zSiteRoles.enum.user &&
      organization.allowUsersToUseGoogleMaps
    ) {
      organization.googleMapsApiKey = decrypt(key);
    }
  }

  if (!organization) {
    redirect('/');
  }

  return (
    <>
      <OrganizationContextProvider organization={organization}>
        <ThemeProvider>{children}</ThemeProvider>
      </OrganizationContextProvider>
    </>
  );
}
