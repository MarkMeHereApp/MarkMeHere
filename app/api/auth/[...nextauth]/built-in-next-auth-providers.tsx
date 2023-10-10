import ZoomProvider from 'next-auth/providers/zoom';
import GithubProvider from 'next-auth/providers/github';
import GithubEduEmail from './customNextAuthProviders/github-edu-email';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import AppleProvider from 'next-auth/providers/apple';
import DiscordProvider from 'next-auth/providers/discord';
import AzureADB2CProvider from 'next-auth/providers/azure-ad-b2c';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CognitoProvider from 'next-auth/providers/cognito';
import FortyTwoProvider from 'next-auth/providers/42-school';
import DuendeIDS6Provider from 'next-auth/providers/duende-identity-server6';
import OneLoginProvider from 'next-auth/providers/onelogin';
import FusionAuthProvider from 'next-auth/providers/fusionauth';
import Auth0Provider from 'next-auth/providers/auth0';
import OktaProvider from 'next-auth/providers/okta';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export type ProviderFunctionParams = {
  clientId: string;
  clientSecret: string;
  allowDangerousEmailAccountLinking: boolean;
  issuer?: string;
  tenantId?: string;
};

export interface Provider {
  key: string;
  CustomMessage?: React.ComponentType;
  defaultDisplayName: string;
  docsLink: string;
  config: (params: any) => any;
}

// Add providers based on providers in
// https://next-auth.js.org/configuration/providers/oauth#built-in-providers
// The key is the file name in providers/ without the .ts extension, find that by looking at the import statement
export const providerFunctions: Provider[] = [
  {
    key: 'zoom',
    defaultDisplayName: 'Zoom',
    docsLink: 'https://developers.zoom.us/docs/integrations/create/',
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
    docsLink: '',
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
    docsLink: 'https://developers.zoom.us/docs/integrations/create/',
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
  },
  {
    key: 'google',
    defaultDisplayName: 'Google',
    docsLink: 'https://console.developers.google.com/apis/credentials',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      GoogleProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  },
  {
    key: 'facebook',
    defaultDisplayName: 'Facebook',
    docsLink: 'https://developers.facebook.com/apps/',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      FacebookProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  },
  {
    key: 'apple',
    defaultDisplayName: 'Apple',
    docsLink: 'https://developer.apple.com/account/resources/',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking,
      issuer
    }: ProviderFunctionParams) =>
      AppleProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean,
        issuer: issuer
      })
  },
  {
    key: 'discord',
    defaultDisplayName: 'Discord',
    docsLink: 'https://discord.com/developers/applications',
    config: ({
      clientId,
      clientSecret,
      allowDangerousEmailAccountLinking
    }: ProviderFunctionParams) =>
      DiscordProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        allowDangerousEmailAccountLinking:
          allowDangerousEmailAccountLinking as boolean
      })
  },
  {
    key: 'azure-ad',
    defaultDisplayName: 'Azure AD',
    docsLink:
      'https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      AzureADProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: 'azure-ad-b2c',
    defaultDisplayName: 'Azure AD B2C',
    docsLink:
      'https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      AzureADB2CProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: 'cognito',
    defaultDisplayName: 'Amazon Cognito',
    docsLink: 'https://console.aws.amazon.com/cognito/',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      CognitoProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: '42-school',
    defaultDisplayName: '42 School',
    docsLink: 'https://api.intra.42.fr/',
    config: ({ clientId, clientSecret }: ProviderFunctionParams) =>
      FortyTwoProvider({
        clientId: clientId,
        clientSecret: clientSecret
      })
  },
  {
    key: 'duende-identity-server6',
    defaultDisplayName: 'Duende Identity Server 6',
    docsLink: 'https://duendesoftware.com/products/identityserver',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      DuendeIDS6Provider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: 'onelogin',
    defaultDisplayName: 'OneLogin',
    docsLink: 'https://www.onelogin.com/developer-docs',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      OneLoginProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: 'fusionauth',
    defaultDisplayName: 'FusionAuth',
    docsLink: 'https://fusionauth.io/docs/v1/tech/oauth/endpoints/',
    config: ({
      clientId,
      clientSecret,
      issuer,
      tenantId
    }: ProviderFunctionParams) =>
      FusionAuthProvider({
        id: 'fusionauth',
        name: 'FusionAuth',
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer,
        tenantId: tenantId
      })
  },
  {
    key: 'auth0',
    defaultDisplayName: 'Auth0',
    docsLink: 'https://manage.auth0.com/dashboard/',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      Auth0Provider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  },
  {
    key: 'okta',
    defaultDisplayName: 'Okta',
    docsLink: 'https://developer.okta.com/',
    config: ({ clientId, clientSecret, issuer }: ProviderFunctionParams) =>
      OktaProvider({
        clientId: clientId,
        clientSecret: clientSecret,
        issuer: issuer
      })
  }
];

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
