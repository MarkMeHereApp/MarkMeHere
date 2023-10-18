import { zSiteRoles } from '@/types/sharedZodTypes';
import z from 'zod';
import { GlobalSiteSettings } from '@prisma/client';
import { useState } from 'react';

export const attendanceTokenExpirationTime = 5 * 60 * 1000; // 5 minutes

export const qrCodeExpirationTime = 5 * 1000; // 5 seconds

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
  { name: 'nick', role: zSiteRoles.enum.moderator },
  { name: 'jadyn', role: zSiteRoles.enum.moderator },
  { name: 'sam', role: zSiteRoles.enum.user },
  { name: 'josef', role: zSiteRoles.enum.user }
];

export const defaultSiteSettings: GlobalSiteSettings = {
  id: 'default',
  darkTheme: 'dark_blue',
  lightTheme: 'light_zinc',
  googleMapsApiKey: '',
  allowModeratorsToUseGoogleMaps: true,
  allowUsersToUseGoogleMaps: true
};

interface Theme {
  darkTheme?: string;
  lightTheme?: string;
  color?: string;
}

export const themeGlobals: Theme[] = [
  {
    darkTheme: 'dark_zinc',
    lightTheme: 'light_zinc'
  },
  {
    darkTheme: 'dark_slate',
    lightTheme: 'light_slate'
  },
  {
    darkTheme: 'dark_stone',
    lightTheme: 'light_stone'
  },
  {
    darkTheme: 'dark_gray',
    lightTheme: 'light_gray'
  },
  {
    darkTheme: 'dark_neutral',
    lightTheme: 'light_neutral'
  },
  {
    darkTheme: 'dark_red',
    lightTheme: 'light_red'
  },
  {
    darkTheme: 'dark_rose',
    lightTheme: 'light_rose'
  },
  {
    darkTheme: 'dark_orange',
    lightTheme: 'light_orange'
  },
  {
    darkTheme: 'dark_green',
    lightTheme: 'light_green'
  },
  {
    darkTheme: 'dark_blue',
    lightTheme: 'light_blue'
  },
  {
    darkTheme: 'dark_yellow',
    lightTheme: 'light_yellow'
  },
  {
    darkTheme: 'dark_purple',
    lightTheme: 'light_purple'
  }
];
