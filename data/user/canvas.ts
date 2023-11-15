'use server';
import 'server-only';
import prisma from '@/prisma';
import { ensureAndGetNextAuthSession } from '../auth';
import { getOrganization } from '../organization/organization';
import { encrypt } from '@/utils/globalFunctions';

export const updateUserWithCanvasData = async ({
  inputOrganizationCode,
  inputUrl,
  inputDevKey
}: {
  inputOrganizationCode: string;
  inputUrl?: string;
  inputDevKey?: string;
}) => {
  const session = await ensureAndGetNextAuthSession();

  const { canvasDevKeyAuthorizedEmail } = await getOrganization(
    inputOrganizationCode
  );

  if (canvasDevKeyAuthorizedEmail !== session.user.email) {
    throw new Error('You do not have permission to add Canvas data to a user');
  }

  let key = undefined;
  if (inputDevKey) {
    key = encrypt(inputDevKey);
  }
  //console.log(key);

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      canvasUrl: inputUrl || null,
      canvasToken: key || null
    }
  });

  return;
};

export const hasCanvasConfigured = async () => {
  const session = await ensureAndGetNextAuthSession();

  const user = await prisma.user.findFirst({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error('No user found!');
  }

  return user.canvasUrl && user.canvasToken ? true : false;
};
