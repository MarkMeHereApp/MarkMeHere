import { zSiteRoles } from '@/types/sharedZodTypes';
import z from 'zod';
import { Organization } from '@prisma/client';
import { useTheme } from 'next-themes';

export const attendanceTokenExpirationTime = 5 * 60 * 1000; // 5 minutes

export const qrCodeExpirationTime = 10 * 1000; // 5 seconds

// When a student scans a QR code right before it expires,
// the server may not have enough time to process the request
// so we add a leeway to the QR code expiration time.
export const qrCodeLeeWay = 2 * 1000; // 2

export const dataTablePaginationSizes = [10, 25, 50, 100];

export const demoAccounts: {
  name: string;
  role: z.infer<typeof zSiteRoles>;
}[] = [
  { name: 'aldrich', role: zSiteRoles.enum.admin },
  { name: 'ben', role: zSiteRoles.enum.admin },
  { name: 'nick', role: zSiteRoles.enum.admin },
  { name: 'jadyn', role: zSiteRoles.enum.admin },
  { name: 'sam', role: zSiteRoles.enum.admin },
  { name: 'josef', role: zSiteRoles.enum.admin }
];

export const defaultSiteSettings: Organization = {
  id: 'default',
  firstTimeSetupComplete: false,
  name: 'test',
  uniqueCode: 'test',
  darkTheme: 'dark_blue',
  lightTheme: 'light_zinc',
  googleMapsApiKey: '',
  hashEmails: false,
  allowUsersToUseGoogleMaps: true,
  canvasDevKeyAuthorizedEmail: null
};
