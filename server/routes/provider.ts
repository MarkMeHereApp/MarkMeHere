import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { generateTypedError } from '@/server/errorTypes';
import { TRPCError } from '@trpc/server';
import { encrypt, decrypt } from '@/utils/globalFunctions';

export const zCreateOrUpdateProvider = z.object({
  displayName: z.string(),
  provider: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
  issuer: z.string().optional().default('')
});

export const providerRouter = router({
  createOrUpdateProvider: publicProcedure
    .input(zCreateOrUpdateProvider)
    .mutation(async (requestData) => {
      const existingProvider = await prisma.authProviderCredentials.findUnique({
        where: { provider: requestData.input.provider }
      });

      const encryptedClientId = encrypt(requestData.input.clientId);
      const encryptedClientSecret = encrypt(requestData.input.clientSecret);
      const encryptedIssuer = encrypt(requestData.input.issuer);

      if (existingProvider) {
        return prisma.authProviderCredentials.update({
          where: { id: existingProvider.id },
          data: {
            displayName: requestData.input.displayName,
            provider: requestData.input.provider,
            clientId: encryptedClientId,
            clientSecret: encryptedClientSecret,
            issuer: encryptedIssuer,
            updatedAt: new Date()
          }
        });
      } else {
        return prisma.authProviderCredentials.create({
          data: {
            displayName: requestData.input.displayName,
            provider: requestData.input.provider,
            clientId: encryptedClientId,
            clientSecret: encryptedClientSecret,
            issuer: encryptedIssuer
          }
        });
      }
    })
});

export type ProviderRouter = typeof providerRouter;
