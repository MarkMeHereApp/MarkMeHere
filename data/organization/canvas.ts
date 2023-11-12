'use server';
import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { decrypt } from '@/utils/globalFunctions';
import { getNextAuthSession } from '../auth';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { getOrganization } from './organization';

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
