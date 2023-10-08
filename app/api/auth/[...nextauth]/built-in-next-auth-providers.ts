import GithubProvider from 'next-auth/providers/github';
import ZoomProvider from 'next-auth/providers/zoom';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GithubEduEmail from './customNextAuthProviders/github-edu-email';

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
    defaultDisplayName: 'Zoom',
    creationLink: 'https://developers.zoom.us/docs/integrations/create/',
    nextAuthDocs: 'https://next-auth.js.org/providers/github',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      ZoomProvider({
        clientId,
        clientSecret,
        allowDangerousEmailAccountLinking: true
      })
  },
  githubedu: {
    key: 'githubedu',
    tested: true,
    defaultDisplayName: 'GitHub (using edu email)',
    creationLink: 'https://developers.zoom.us/docs/integrations/create/',
    nextAuthDocs: 'https://next-auth.js.org/providers/github',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      GithubEduEmail({
        clientId,
        clientSecret,
        allowDangerousEmailAccountLinking: true
      })
  }
};
