'use server';
import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { decrypt } from '@/utils/globalFunctions';
import { ensureAndGetNextAuthSession } from '../auth';
import { zSiteRoles } from '@/types/sharedZodTypes';

export const getOrganization = async (inputOrganizationCode: string) => {
  const session = await ensureAndGetNextAuthSession();

  const organization = await prisma.organization.findFirst({
    where: { uniqueCode: inputOrganizationCode }
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
      session.user.role === zSiteRoles.enum.user &&
      organization.allowUsersToUseGoogleMaps
    ) {
      organization.googleMapsApiKey = decrypt(key);
    }
  }

  return organization;
};
