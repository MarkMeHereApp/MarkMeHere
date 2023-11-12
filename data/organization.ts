import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { decrypt } from '@/utils/globalFunctions';
import { getNextAuthSession } from './auth';
import { zSiteRoles } from '@/types/sharedZodTypes';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const getOrganization = async () => {
  const session = await getNextAuthSession();

  const organization = await prisma.organization.findFirst();

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
