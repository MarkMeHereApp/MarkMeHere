import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PiUserCircleGear } from 'react-icons/pi';

export default function TempAdminInfo() {
  return (
    <div className="pb-4">
      <Alert>
        <PiUserCircleGear className="w-5 h-5" />
        <AlertTitle>
          <b className="text-primary">
            Looks Like You Want To Use a Temp Admin Login!
          </b>
        </AlertTitle>
        <AlertDescription className="text-left">
          You must add <code>TEMP_ADMIN_SECRET</code> with <b>any</b> value to
          your .env file, then login with your set secret through the "Log Into
          Temp Admin" button.
          <br />
          <br />
          <span className="text-destructive">
            <b>
              After Logging in, please remove the TEMP_ADMIN_SECRET value from
              your .env file to prevent unauthorized access.
            </b>
          </span>
          <br />
          <br />
          Visit our documentation for more information.
        </AlertDescription>
      </Alert>
    </div>
  );
}
