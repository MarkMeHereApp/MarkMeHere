import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export function AuthProviderWarning({ docsLink }: { docsLink: string }) {
  return (
    <div className="py-4">
      <Alert>
        <ExclamationTriangleIcon />
        <AlertTitle>Warning!</AlertTitle>
        <AlertDescription>
          This Provider is untested.{' '}
          <a href={'https://github.com/MarkMeHereApp/MarkMeHere/issues'}>
            <b className="text-primary">Click here</b>
          </a>{' '}
          to report any issues you encounter. For more information, see{' '}
          <a href={docsLink}>
            <b className="text-primary">the next-auth documentation.</b>
          </a>{' '}
          <i>
            Note our implementation of next-auth uploades the token into our
            database, instead of storing it in the environment variables which
            is what the next-auth documentation assumes.
          </i>
        </AlertDescription>
      </Alert>
    </div>
  );
}
