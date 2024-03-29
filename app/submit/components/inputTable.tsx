import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'components/ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { firaSansLogo } from '@/utils/fonts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Loading from '@/components/general/loading';

enum ErrorType {
  InvalidInput,
  InvalidQR,
  InvalidGeolocation
}

const InputTable = () => {
  const [inputValue, setInputValue] = useState(''); //input value in the field
  const [errorDisplay, setErrorDisplay] = useState<string | null>(null); //error message that is being displayed if either QR code is not valid or the input code is not valid
  const [error, setError] = useState<Error | null>(null); //error message that is being displayed if either QR code is not valid or the input code is not valid

  const router = useRouter(); //initalizing the router

  const searchParams = useSearchParams();
  const errorType = searchParams ? searchParams.get('error') : null; //storing the searchParams with 'error' included, that is then being used the in the UseEffect below

  const [isLoadingSubmit, setIsLoadingSubmit] = React.useState<boolean>(false);
  const hasDisplayedQRError = useRef(false);

  if (error) {
    throw error;
  }

  const displayError = (errorType: ErrorType) => {
    switch (errorType) {
      case ErrorType.InvalidInput:
        setErrorDisplay('Invalid Input Code');
        toast({
          title: 'The input code is not valid',
          description:
            'The code you input is not valid or has expired, enter a new code.',
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
        });
        break;
      case ErrorType.InvalidQR:
        setErrorDisplay('Invalid QR Code');
        toast({
          title: 'The QR code is not valid',
          description:
            'The QR code you scanned is no longer valid or has expired, scan again or enter a new code.',
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
        });
        break;
      case ErrorType.InvalidGeolocation:
        break;
      default:
        setErrorDisplay('Geolocation Error');
        toast({
          title: 'Unable to Verify You',
          description:
            'Unfortunately, we were not able to verify you. Please scan the QR code again or enter the code.',
          icon: 'error_for_destructive_toasts',
          variant: 'destructive'
        });
        break;
    }
  };

  //On Submit, button, we make a server call to validate and create the attendance token
  //the function calls, '/server/routes/attendanceToken.ts'
  //if success, we redirect straight to the markAttendance, with the specific attendanceTokenId (currently uid)
  //if fails, we display the error message specific to the invalid input
  const validateAndCreateToken =
    trpc.sessionless.ValidateAndCreateAttendanceToken.useMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //router.refresh()
    setIsLoadingSubmit(true); // Set loading to true at the start of the function

    try {
      const res = await validateAndCreateToken.mutateAsync({
        code: inputValue.toUpperCase()
      });

      if (res.success && res.token) {
        if (res.location) {
          router.push(
            `${res.course.organizationCode}/${res.course.courseCode}/verification?attendanceTokenId=${res.token}`
          );
        }

        if (!res.location) {
          router.push(
            `/${res.course.organizationCode}/${res.course.courseCode}/student?attendanceTokenId=${res.token}`
          );
        }
      }

      if (!res.success) {
        displayError(ErrorType.InvalidInput);
        setIsLoadingSubmit(false); // Set loading to false at the end of the function
      }
    } catch (error) {
      setIsLoadingSubmit(false); // Set loading to false at the end of the function
      setError(error as Error);
    }
  };

  //checking what error type have we recieved in the server through the URL.
  //after the error message being displayed, we replace the URL with /submit and stay on page.
  //if we check more things than just qr-error, it will be added as another if statement.
  useEffect(() => {
    if (errorType && !hasDisplayedQRError.current) {
      if (errorType === 'qr-error') {
        displayError(ErrorType.InvalidQR);
        hasDisplayedQRError.current = true;
      }
      if (errorType === 'unknown') {
        displayError(ErrorType.InvalidGeolocation);
        hasDisplayedQRError.current = true;
      }
    }

    router.replace('/submit');
  }, [errorType]);

  return (
    <Card className=" min-w-[300px] w-[25%] mx-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center ">
      <CardTitle className="text-2xl font-bold font-mono text-center">
        <span className={firaSansLogo.className}>Enter the Code</span>
      </CardTitle>

      <Alert className="text-center text-red-500 border-0">
        {errorDisplay && (
          <AlertDescription className="">{errorDisplay}</AlertDescription>
        )}
      </Alert>

      <form
        onSubmit={handleSubmit}
        className="gap-4 flex flex-col items-center pt-0 p-6 w-[100%]"
      >
        <Input
          className="w-[100%] h-[30%] font-bold font-mono text-center text-4xl"
          type="text"
          value={inputValue.toUpperCase()}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={isLoadingSubmit}
        />
        <Button
          type="submit"
          className=" flex w-[100%]"
          disabled={isLoadingSubmit}
        >
          {isLoadingSubmit ? <Loading /> : 'Submit'}
        </Button>
      </form>
    </Card>
  );
};

export default InputTable;
