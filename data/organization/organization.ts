'use server';
import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { decrypt } from '@/utils/globalFunctions';
import { getNextAuthSession } from '../auth';
import { zSiteRoles } from '@/types/sharedZodTypes';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const getOrganization = async (inputOrganizationCode: string) => {
  const session = await getNextAuthSession();

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

export const addCanvasAuthorizedUserToOrganization = async ({
  inputOrganizationCode,
  inputEmail
}: {
  inputOrganizationCode: string;
  inputEmail: string;
}) => {
  const session = await getNextAuthSession();

  if (session.user.role !== zSiteRoles.enum.admin) {
    throw new Error(
      'You do not have permission to add a Canvas authorized user to an organization'
    );
  }

  const { hashEmails } = await getOrganization(inputOrganizationCode);

  const email = hashEmails ? hashEmail(inputEmail) : inputEmail;

  const { canvasDevKeyAuthorizedEmail } = await prisma.organization.update({
    where: { uniqueCode: inputOrganizationCode },
    data: {
      canvasDevKeyAuthorizedEmail: email
    }
  });

  return canvasDevKeyAuthorizedEmail;
};

export const deleteCanvasAuthorizedUserFromOrganization = async (
  inputOrganizationCode: string
) => {
  const session = await getNextAuthSession();

  if (session.user.role !== zSiteRoles.enum.admin) {
    throw new Error(
      'You do not have permission to delete a Canvas authorized user from an organization'
    );
  }

  await prisma.organization.update({
    where: { uniqueCode: inputOrganizationCode },
    data: {
      canvasDevKeyAuthorizedEmail: null
    }
  });
};
