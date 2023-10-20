import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PiUserCircleGear } from 'react-icons/pi';

export default function TempAdminInfo() {
  return (
    <div className="pb-4">
      <Alert>
        <PiUserCircleGear className="w-5 h-5" />

        <AlertDescription className="text-left">
          After logging into this temporary Admin account, please immediately
          create your admin account and link an Authentication Provider through
          the Admin Settings. <br />
          <span className="text-destructive">
            <b>
              After setting up an actual user, please remove the
              FIRST_TIME_SETUP_ADMIN_PASSWORD value from your .env file to
              prevent unauthorized access.
            </b>
          </span>
          <br />
          <br />
          <b>
            <a className="text-primary" href="https://markmehere.com">
              Click here to visit the first time setup guide.
            </a>
          </b>
        </AlertDescription>
      </Alert>
    </div>
  );
}
