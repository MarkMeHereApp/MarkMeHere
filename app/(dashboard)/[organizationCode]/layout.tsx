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

  if (!session?.user?.email) {
    throw new Error('No email found in session');
  }

  const organization = await prisma.organization.findFirst({
    where: { uniqueCode: params.organizationCode }
  });

  if (!organization) {
    throw new Error('No organization found!');
  }

  if (organization?.googleMapsApiKey) {
    const key = organization.googleMapsApiKey;

    organization.googleMapsApiKey = '';

    if (session.user.role === zSiteRoles.enum.admin) {
      organization.googleMapsApiKey = decrypt(key);
    }

    if (
      session.user.role === zSiteRoles.enum.moderator &&
      organization.allowModeratorsToUseGoogleMaps
    ) {
      organization.googleMapsApiKey = decrypt(key);
    }

    if (
      session.user.role === zSiteRoles.enum.user &&
      organization.allowUsersToUseGoogleMaps
    ) {
      organization.googleMapsApiKey = decrypt(key);
    }
  }

  return (
    <>
      <OrganizationContextProvider organization={organization}>
        <ThemeProvider>{children}</ThemeProvider>
      </OrganizationContextProvider>
    </>
  );
}
