'use client';

import { ReloadIcon } from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ErrorComponent = ({
  error,
  reset,
  className,
  ...props
}: {
  error: Error;
  reset: () => void;
  className?: string;
}) => {
  const router = useRouter();

  // Return null or some JSX
  return (
    <div className="relative min-h-screen">
      <Card className=" w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 flex flex-col items-center justify-between space-y-4">
        <CardHeader>
          <CardTitle className="pb-6 text-destructive">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CrossCircledIcon style={{ width: 48, height: 48 }} />
              <span className="pl-4 text-3xl">Unexpected Error:</span>
            </div>
          </CardTitle>
          <CardDescription>
            {' '}
            <Alert style={{ height: '15vh' }}>
              <AlertTitle style={{ fontSize: '2em', textAlign: 'center' }}>
                {error.name}
              </AlertTitle>
              <AlertDescription className="overflow-auto py-8 ">
                {`
              The error message is indicating that the setDynamicQRCode function is expecting a React.ComponentType but you are trying to assign a React.ComponentType<> to it.

The setDynamicQRCode function is expecting a component with a single prop url, but you are trying to assign a component that requires two props url and currentCourseUrl.

To fix this, you need to adjust the type of the state variable DynamicQRCode to match the component you are trying to assign to it. Here's how you can do it:
`}
              </AlertDescription>
            </Alert>
          </CardDescription>
        </CardHeader>
        <CardFooter className="space-x-4">
          <Button onClick={reset}>
            <ReloadIcon className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Button
            onClick={() => {
              router.push('/');
            }}
          >
            Go To Home Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorComponent;
