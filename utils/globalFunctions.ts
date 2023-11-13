import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto, { createHash } from 'crypto';
import prisma from '@/prisma';
import { Prisma, Organization, User } from '@prisma/client';
import { defaultSiteSettings } from '@/utils/globalVariables';

export const distanceBetween2Points = (
  profLat: number,
  profLong: number,
  studLat: number,
  studLong: number
) => {
  if (profLat == studLat && profLong == studLong) {
    return 0;
  } else {
    const radlat1 = (Math.PI * profLat) / 180;
    const radlat2 = (Math.PI * studLat) / 180;
    const theta = profLong - studLong;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 6076.11549; //nothing: nautical miles,  miles: * 1.1515, km: * 1.852, meters: * 1852, feet: * 6,076.11549
    return dist;
  }
};

export function getPublicUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.toString();
  }

  if (typeof window !== 'undefined' && window.location.origin) {
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
  select?: Prisma.OrganizationSelect
): Promise<Organization> => {
  const siteSettingsDB = await prisma.organization.findFirst({
    select: select
  });

  if (siteSettingsDB) {
    return siteSettingsDB;
  }

  throw new Error('Organization not found');
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
