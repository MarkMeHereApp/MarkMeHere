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
    // @TODO this should return an error. Basically, the first time setup won't have a user in the database, but we still
    // We should have another layout in a higher level, but atm I don't want to break everyone's git lol
    // throw new Error ("No User Data!")
    return <>{children}</>;
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

  return (
    <>
      <OrganizationContextProvider organization={organization}>
        <ThemeProvider>{children}</ThemeProvider>
      </OrganizationContextProvider>
    </>
  );
}
