import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { encrypt, decrypt } from '@/utils/globalFunctions';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';

const zUpdateOrganization = z.object({
  googleMapsApiKey: z.string().optional(),
  allowModeratorsToUseGoogleMaps: z.boolean().optional(),
  allowUsersToUseGoogleMaps: z.boolean().optional(),
  darkTheme: z.string().optional(),
  lightTheme: z.string().optional()
});
const zCreateOrganization = z.object({
  name: z.string(),
  uniqueCode: z.string()
});

export const organizationRouter = router({
  createOrganization: publicProcedure
    .input(zCreateOrganization)
    .mutation(async (requestData) => {
      try {
        return await prisma.globalSiteSettings.create({
          data: {
            name: requestData.input.name,
            uniqueCode: requestData.input.uniqueCode.toLowerCase()
          }
        });
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  getOrganization: publicProcedure.input(z.object({})).query(async () => {
    try {
      return await getGlobalSiteSettings_Server();
    } catch (error) {
      throw generateTypedError(error as Error);
    }
  }),
  updateOrganization: publicProcedure
    .input(zUpdateOrganization)
    .mutation(async (requestData) => {
      try {
        const organizationSettings = await getGlobalSiteSettings_Server();
        // Make sure there is only one organization settings.
        const allSiteSettings = await prisma.globalSiteSettings.findMany({});
        if (allSiteSettings.length > 1) {
          await prisma.globalSiteSettings.deleteMany();
          throw generateTypedError(
            new Error(
              'More than one organization settings found, this should never happen. Please try again!'
            )
          );
        }

        let googleMapsApiKey = organizationSettings.googleMapsApiKey;
        if (requestData.input.googleMapsApiKey !== undefined) {
          googleMapsApiKey = encrypt(requestData.input.googleMapsApiKey);
        }

        let allowedModeratorsToUseGoogleMaps =
          organizationSettings.allowModeratorsToUseGoogleMaps;
        if (requestData.input.allowModeratorsToUseGoogleMaps !== undefined) {
          allowedModeratorsToUseGoogleMaps =
            requestData.input.allowModeratorsToUseGoogleMaps;
        }

        let allowedUsersToUseGoogleMaps =
          organizationSettings.allowUsersToUseGoogleMaps;
        if (requestData.input.allowUsersToUseGoogleMaps !== undefined) {
          allowedUsersToUseGoogleMaps =
            requestData.input.allowUsersToUseGoogleMaps;
        }

        let darkTheme = organizationSettings.darkTheme;
        if (requestData.input.darkTheme !== undefined) {
          darkTheme = requestData.input.darkTheme;
        }

        let lightTheme = organizationSettings.lightTheme;
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

export type OrganizationRouter = typeof organizationRouter;