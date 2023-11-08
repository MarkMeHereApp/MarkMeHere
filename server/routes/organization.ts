import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { encrypt, decrypt } from '@/utils/globalFunctions';
import { getGlobalSiteSettings_Server } from '@/utils/globalFunctions';
import { TRPCError } from '@trpc/server';
import adminProcedure from '../middleware/adminProcedure';

const zUpdateOrganization = z.object({
  googleMapsApiKey: z.string().optional(),
  allowUsersToUseGoogleMaps: z.boolean().optional(),
  darkTheme: z.string().optional(),
  lightTheme: z.string().optional()
});
const zCreateOrganization = z.object({
  name: z.string(),
  uniqueCode: z.string()
});

const zFinishOrganizationSetup = z.object({
  uniqueCode: z.string()
});

export const organizationRouter = router({
  finishOrganizationSetup: adminProcedure
    .input(zFinishOrganizationSetup)
    .mutation(async (requestData) => {
      try {
        return await prisma.organization.update({
          where: { uniqueCode: requestData.input.uniqueCode },
          data: { firstTimeSetupComplete: true }
        });
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  updateOrganization: adminProcedure
    .input(zUpdateOrganization)
    .mutation(async (requestData) => {
      try {
        const organizationSettings = await getGlobalSiteSettings_Server();
        // Make sure there is only one organization settings.
        const allSiteSettings = await prisma.organization.findMany({});
        if (allSiteSettings.length > 1) {
          await prisma.organization.deleteMany();
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

        const updated = await prisma.organization.updateMany({
          data: {
            googleMapsApiKey: googleMapsApiKey,
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
