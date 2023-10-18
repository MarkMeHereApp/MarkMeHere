import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { encrypt, decrypt } from '@/utils/globalFunctions';
import crypto from 'crypto';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';

const zGlobalSiteSettings = z.object({
  googleMapsApiKey: z.string().optional(),
  allowModeratorsToUseGoogleMaps: z.boolean().optional(),
  allowUsersToUseGoogleMaps: z.boolean().optional(),
  darkTheme: z.string().optional(),
  lightTheme: z.string().optional()
});

export const siteSettingsRouter = router({
  getSiteSettings: publicProcedure.input(z.object({})).query(async () => {
    try {
      return await getGlobalSiteSettings_Server();
    } catch (error) {
      throw generateTypedError(error as Error);
    }
  }),
  updateSiteSettings: publicProcedure
    .input(zGlobalSiteSettings)
    .mutation(async (requestData) => {
      try {
        const siteSettings = await getGlobalSiteSettings_Server();
        // Make sure there is only one site settings.
        const allSiteSettings = await prisma.globalSiteSettings.findMany({});
        if (allSiteSettings.length > 1) {
          await prisma.globalSiteSettings.deleteMany();
          throw generateTypedError(
            new Error(
              'More than one site settings found, this should never happen. Please try again!'
            )
          );
        }

        let googleMapsApiKey = siteSettings.googleMapsApiKey;
        if (requestData.input.googleMapsApiKey !== undefined) {
          googleMapsApiKey = encrypt(requestData.input.googleMapsApiKey);
        }

        let allowedModeratorsToUseGoogleMaps =
          siteSettings.allowModeratorsToUseGoogleMaps;
        if (requestData.input.allowModeratorsToUseGoogleMaps !== undefined) {
          allowedModeratorsToUseGoogleMaps =
            requestData.input.allowModeratorsToUseGoogleMaps;
        }

        let allowedUsersToUseGoogleMaps =
          siteSettings.allowUsersToUseGoogleMaps;
        if (requestData.input.allowUsersToUseGoogleMaps !== undefined) {
          allowedUsersToUseGoogleMaps =
            requestData.input.allowUsersToUseGoogleMaps;
        }

        let darkTheme = siteSettings.darkTheme;
        if (requestData.input.darkTheme !== undefined) {
          darkTheme = requestData.input.darkTheme;
        }

        let lightTheme = siteSettings.lightTheme;
        if (requestData.input.lightTheme !== undefined) {
          lightTheme = requestData.input.lightTheme;
        }

        const updated = await prisma.globalSiteSettings.updateMany({
          data: {
            googleMapsApiKey: googleMapsApiKey,
            allowModeratorsToUseGoogleMaps: allowedModeratorsToUseGoogleMaps,
            allowUsersToUseGoogleMaps: allowedUsersToUseGoogleMaps,
            lightTheme: lightTheme,
            darkTheme: darkTheme
          }
        });
        return { success: updated.count > 0 };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type SiteSettingsRouter = typeof siteSettingsRouter;
