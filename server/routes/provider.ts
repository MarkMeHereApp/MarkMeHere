import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { encrypt, decrypt } from '@/utils/globalFunctions';
import crypto from 'crypto';

export const zCreateOrUpdateProvider = z.object({
  displayName: z.string(),
  provider: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  allowDangerousEmailAccountLinking: z.boolean(),
  issuer: z.string().optional(),
  tenantId: z.string().optional()
});

export const providerRouter = router({
  createOrUpdateProvider: publicProcedure
    .input(zCreateOrUpdateProvider)
    .mutation(async (requestData) => {
      try {
        const encryptedClientId = encrypt(requestData.input.clientId);
        const encryptedClientSecret = encrypt(requestData.input.clientSecret);
        const encryptedIssuer = requestData.input.issuer
          ? encrypt(requestData.input.issuer)
          : undefined;
        const encryptedTenantId = requestData.input.tenantId
          ? encrypt(requestData.input.tenantId)
          : undefined;

        const authprovder = await prisma.authProviderCredentials.create({
          data: {
            displayName: requestData.input.displayName,
            key: requestData.input.provider,
            clientId: encryptedClientId,
            clientSecret: encryptedClientSecret,
            issuer: encryptedIssuer,
            tenantId: encryptedTenantId,
            allowDangerousEmailAccountLinking:
              requestData.input.allowDangerousEmailAccountLinking
          }
        });

        return { success: true };
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    }),
  getActiveProviders: publicProcedure.input(z.object({})).query(async () => {
    try {
      const authProviders = await prisma.authProviderCredentials.findMany({});
      const providerDisplayNames = authProviders.map(
        (provider) => provider.displayName
      );

      return { success: true, providerDisplayNames };
    } catch (error) {
      throw generateTypedError(error as Error);
    }
  }),
  deleteActiveProvider: publicProcedure
    .input(z.object({ displayName: z.string() }))
    .mutation(async (requestData) => {
      try {
        const deletedProvider = await prisma.authProviderCredentials.delete({
          where: { displayName: requestData.input.displayName }
        });

        if (deletedProvider) {
          return { success: true };
        }

        throw generateTypedError(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Could not delete Provider'
          })
        );
      } catch (error) {
        throw generateTypedError(error as Error);
      }
    })
});

export type ProviderRouter = typeof providerRouter;
