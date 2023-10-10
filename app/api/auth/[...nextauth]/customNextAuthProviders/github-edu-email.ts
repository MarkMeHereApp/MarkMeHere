// We've found that for some UCF students, their zoom email is not correct, however, the employee ID seems to always be linked to the correct email.
// This provider will use the employee ID as the email address for the user.

import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/';

/** @see https://docs.github.com/en/rest/users/users#get-the-authenticated-user */
export interface GithubProfile extends Record<string, any> {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username?: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists?: number;
  total_private_repos?: number;
  owned_private_repos?: number;
  disk_usage?: number;
  suspended_at?: string | null;
  collaborators?: number;
  two_factor_authentication: boolean;
  plan?: {
    collaborators: number;
    name: string;
    space: number;
    private_repos: number;
  };
}

export interface GithubEmail extends Record<string, any> {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: 'public' | 'private';
}

export default function GithubEduEmail<P extends GithubProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'githubedu',
    name: 'GitHub using edu email',
    type: 'oauth',
    authorization: {
      url: 'https://github.com/login/oauth/authorize',
      params: { scope: 'read:user user:email' }
    },
    token: 'https://github.com/login/oauth/access_token',
    userinfo: {
      url: 'https://api.github.com/user',
      async request({ client, tokens }) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const profile = await client.userinfo(tokens.access_token!);

        // We want to get the .edu email address from the user's github account.
        // See https://docs.github.com/en/rest/users/emails#list-public-email-addresses-for-the-authenticated-user
        const res = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `token ${tokens.access_token}` }
        });

        if (res.ok) {
          const emails: GithubEmail[] = await res.json();
          const eduEmails = emails.filter((e) => e.email.endsWith('.edu'));

          if (!eduEmails) {
            throw new Error('NoEdu');
          }

          if (eduEmails.length > 1) {
            throw new Error('MultipleEdu');
          }

          const eduEmail = eduEmails[0];

          if (eduEmail.verified === false) {
            throw new Error('EduNotVerified');
          }
          profile.email = eduEmail.email;
        } else {
          throw new Error('EmailFetchError');
        }

        return profile;
      }
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email ?? 'NA',
        image: profile.avatar_url,
        role: profile.role
      };
    },
    style: {
      logo: '/github.svg',
      logoDark: '/github-dark.svg',
      bg: '#fff',
      bgDark: '#000',
      text: '#000',
      textDark: '#fff'
    },
    options
  };
}
