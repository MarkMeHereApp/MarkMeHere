import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto from 'crypto';
import prisma from '@/prisma';
import { Prisma, GlobalSiteSettings } from '@prisma/client';
import { defaultSiteSettings } from '@/utils/globalVariables';

export function getPublicUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.toString();
  }

  if (window.location.origin) {
    return window.location.origin;
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return 'https://' + process.env.NEXT_PUBLIC_VERCEL_URL.toString();
  }

  return 'URL_ERROR';
}

export function formatString(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// These are errors that are expected: duplicate course, already enrolled, etc.
export function toastError(error: string, action?: ToastActionElement) {
  toast({
    title: 'Error',
    icon: 'error_for_destructive_toasts',
    variant: 'destructive',
    description: error,
    action: action
  });
}

// These are warnings that are expected.
export function toastWarning(
  warning: string,
  action?: ToastActionElement | undefined
) {
  toast({
    title: 'Warning',
    icon: 'warning',
    description: warning,
    action: action
  });
}

// TThis is the generic success message
export function toastSuccess(
  successMessage: string,
  action?: ToastActionElement | undefined
) {
  toast({
    title: 'Success!',
    icon: 'success',
    description: successMessage,
    action: action
  });
}

export const getGlobalSiteSettings_Server = async (
  select?: Prisma.GlobalSiteSettingsSelect
): Promise<GlobalSiteSettings> => {
  const siteSettingsDB = await prisma.globalSiteSettings.findFirst({
    select: select
  });

  if (siteSettingsDB) {
    return siteSettingsDB;
  }

  await prisma.globalSiteSettings.create({
    data: defaultSiteSettings
  });

  const newSiteSettings = await prisma.globalSiteSettings.findFirst({
    select: select
  });

  if (!newSiteSettings) {
    throw new Error('Failed to create initial site settings');
  }

  return newSiteSettings;
};

export function encrypt(text: string, key?: string) {
  let bufferKey = '';
  if (key) {
    bufferKey = key;
  } else {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET not set');
    }
    bufferKey = process.env.NEXTAUTH_SECRET!;
  }

  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(bufferKey), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string, key?: string) {
  let bufferKey = '';
  if (key) {
    bufferKey = key;
  } else {
    if (!process.env.NEXTAUTH_SECRET) {
      throw new Error('NEXTAUTH_SECRET not set');
    }
    bufferKey = process.env.NEXTAUTH_SECRET!;
  }

  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift()!, 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(bufferKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
