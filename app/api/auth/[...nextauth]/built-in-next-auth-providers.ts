import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import AzureADProvider from 'next-auth/providers/azure-ad';

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
    defaultDisplayName: 'GitHub',
    creationLink: 'https://github.com/settings/applications/new',
    nextAuthDocs: 'https://next-auth.js.org/providers/github',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      GithubProvider({
        clientId,
        clientSecret
      })
  },
  azuread: {
    key: 'azuread',
    tested: false,
    defaultDisplayName: 'Azure AD',
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
