import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';

export default function DemoMode() {
  return (
    <div className="pb-4">
      <Alert>
        <Icons.logo className="text-primary wave-infinite " />
        <AlertTitle className="">
          <b className="text-primary">Welcome to the Mark Me Here Demo!</b>
        </AlertTitle>
        <AlertDescription className="text-left">
          <p>This is a demo of the Mark Me Here system.</p>
          <p>Select a demo account to check it out!</p>
          <p>
            For more information visit{' '}
            <b>
              <a className="text-primary" href="https://markmehere.com">
                MarkMeHere.com
              </a>{' '}
            </b>
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
