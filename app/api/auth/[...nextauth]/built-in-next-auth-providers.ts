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
  github: {
    key: 'github',
    tested: true,
    displayName: 'GitHub',
    creationLink: 'https://github.com/settings/applications/new',
    nextAuthDocs: 'https://next-auth.js.org/providers/github',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      GithubProvider({
        clientId,
        clientSecret
      })
  },
  azuread: {
    key: 'azure-ad',
    tested: false,
    displayName: 'Azure AD',
    nextAuthDocs: 'https://next-auth.js.org/providers/azure-ad',
    creationLink:
      'https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      AzureADProvider({
        clientId,
        clientSecret,
        issuer
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
