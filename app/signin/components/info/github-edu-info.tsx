import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function GitHubEduMessage({
  providers
}: {
  providers: Array<{ key: string; displayName: string }>;
}) {
  const githubEduProvider = providers.find(
    (provider) => provider.key === 'githubedu'
  );
  if (githubEduProvider) {
    return (
      <div className="px-4">
        To log in with <b>{githubEduProvider.displayName}</b> you must ensure
        you have <b> exactly one verified .edu</b> email linked to your GitHub
        account, it <b>doesn't have to be</b> your primary email, but it's the
        email we use to sign you in.
        <br />
        <br />
        <a href="https://github.com/settings/emails" className="text-primary">
          Go to your GitHub Email Settings to configure that.
        </a>
        <br />
        <br />
        If no verified .edu emails are found, or if there are multiple .edu
        emails linked, you will receive a{' '}
        <b className="text-destructive">Third-Party Callback Error.</b>
      </div>
    );
  }

  return <></>;
}
