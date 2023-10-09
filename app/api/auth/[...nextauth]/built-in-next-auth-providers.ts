import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import AzureADProvider from 'next-auth/providers/azure-ad';
import type { AuthOptions, NextAuthOptions } from 'next-auth';
import prisma from '@/prisma';
import { decrypt } from '@/utils/globalFunctions';
interface ProviderFunctionParams {
  clientId: string;
  clientSecret: string;
  issuer?: string;
}

// Add providers based on providers in
// https://next-auth.js.org/configuration/providers/oauth#built-in-providers
// The key is the file name in providers/ without the .ts extension, find that by looking at the import statement
export const providerFunctions = {
  zoom: {
    key: 'zoom',
    tested: true,
    displayName: 'Zoom',
    creationLink: 'https://developers.zoom.us/docs/integrations/create/',
    nextAuthDocs: 'https://next-auth.js.org/providers/github',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      ZoomProvider({
        clientId,
        clientSecret
      })
  }
};

export async function getBuiltInNextAuthProviders(): Promise<
  AuthOptions['providers']
> {
  const builtInAuthProviders = [] as AuthOptions['providers'];

  const providers = await prisma.authProviderCredentials.findMany({
    where: {
      enabled: true
    }
  });

  providers.forEach((provider) => {
    const providerFunction =
      providerFunctions[provider.provider as keyof typeof providerFunctions];
    if (!providerFunction) {
      throw new Error(`Provider ${provider.provider} not found`);
    }

    builtInAuthProviders.push(
      providerFunction.config({
        clientId: decrypt(provider.clientId),
        clientSecret: decrypt(provider.clientSecret),
        issuer: provider.issuer ? decrypt(provider.issuer) : undefined
      })
    );
  });
  return builtInAuthProviders;
}
