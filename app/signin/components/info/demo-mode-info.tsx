import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/ui/icons';

export default function DemoMode() {
  return (
    <div className="pb-4">
      <Alert>
        <Icons.logo className="text-primary wave" />
        <AlertTitle>
          <b className="text-primary">Welcome to the Mark Me Here Demo!</b>
        </AlertTitle>
        <AlertDescription className="text-left">
          This is a demo of the Mark Me Here system. You can log in by clicking
          "Log Into Temp Admin"
          <br />
          <br />
          This action will allow you to log in as an admin and access the entire
          site.
          <br />
          <br />
          You can even add another Auth Provider in the admin settings, add a
          new user, and log in as that user.
        </AlertDescription>
      </Alert>
    </div>
  );
}
