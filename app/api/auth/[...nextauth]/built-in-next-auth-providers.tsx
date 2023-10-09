import ZoomProvider from 'next-auth/providers/zoom';
import GithubProvider from 'next-auth/providers/github';
import GithubEduEmail from './customNextAuthProviders/github-edu-email';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import TwitterProvider from 'next-auth/providers/twitter';
import AppleProvider from 'next-auth/providers/apple';
import TwitchProvider from 'next-auth/providers/twitch';
import SpotifyProvider from 'next-auth/providers/spotify';
import DiscordProvider from 'next-auth/providers/discord';

export type ProviderFunctionParams = {
  clientId: string;
  clientSecret: string;
  allowDangerousEmailAccountLinking: boolean;
  issuer?: string;
};

export interface Provider {
  key: string;
  CustomMessage?: React.ComponentType;
  defaultDisplayName: string;
  creationLink: string;
  config: (params: any) => any;
}

// Add providers based on providers in
// https://next-auth.js.org/configuration/providers/oauth#built-in-providers
// The key is the file name in providers/ without the .ts extension, find that by looking at the import statement
export const providerFunctions: Provider[] = [
  {
    key: 'zoom',
    defaultDisplayName: 'Zoom',
    creationLink: 'https://developers.zoom.us/docs/integrations/create/',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      ZoomProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  },
  {
    key: 'github',
    defaultDisplayName: 'GitHub',
    creationLink: '',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      GithubProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  },
  {
    key: 'githubedu',
    defaultDisplayName: 'GitHub Edu',
    CustomMessage: GitHubEduMessage,
    creationLink: 'https://developers.zoom.us/docs/integrations/create/',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      GithubEduEmail({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  }
];

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

function GitHubEduMessage() {
  return (
    <Alert>
      <GitHubLogoIcon />
      <AlertTitle>GitHub Edu Provider Information</AlertTitle>
      <AlertDescription>
        GitHub offers the ability to link multiple accounts to a single GitHub
        account through the{' '}
        <a href="https://github.com/settings/emails" className="text-primary">
          settings.
        </a>
        <br />
        <br />
        When a user attempts to log in using the GitHub Edu provider, the system
        will scan the linked emails in the user's GitHub account. It will then
        select an email with a .edu domain for the sign-in process.
        <br />
        <br />
        If no .edu emails are found, or if there are multiple .edu emails
        linked, this provider will not sign in the user.
      </AlertDescription>
    </Alert>
  );
}
