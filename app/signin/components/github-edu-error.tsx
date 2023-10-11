import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function GitHubEduError({
  providers,
  errorType
}: {
  providers: Array<{ key: string; displayName: string }>;
  errorType: string | null;
}) {
  const githubEduProvider = providers.find(
    (provider) => provider.key === 'githubedu'
  );
  if (githubEduProvider && errorType === 'OAuthCallback') {
    return (
      <div className="pb-4">
        <Alert>
          <GitHubLogoIcon />
          <AlertTitle>
            <b className="text-destructive">Third-Party Callback Error.</b>
          </AlertTitle>
          <AlertDescription className="text-left">
            If the error was caused by <b>{githubEduProvider.displayName}</b> it
            could be because you GitHub account was not configured properly so
            please ensure the following:
            <br />
            <br />
            You must you have <b>exactly one verified .edu</b> email linked to
            your GitHub account, it <b>doesn't have to be</b> your primary
            email, but it's the email we use to sign you in.
            <br />
            <br />
            <a
              href="https://github.com/settings/emails"
              className="text-primary"
            >
              Go to your GitHub Email Settings to configure that.
            </a>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <></>;
}
