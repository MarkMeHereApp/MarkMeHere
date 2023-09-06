'use client';
import { Button } from '@/components/ui/button';

const ErrorTestingPage = () => {
  const throwError = (message: string) => {
    throw new Error(message);
  };

  return (
    <div>
      <Button style={{ padding: '10px' }} onClick={() => throwError('Error 1')}>
        Throw Error 1
      </Button>
      <br />
      <Button style={{ padding: '10px' }} onClick={() => throwError('Error 2')}>
        Throw Error 2
      </Button>
      <br />
      <Button style={{ padding: '10px' }} onClick={() => throwError('Error 3')}>
        Throw Error 3
      </Button>
      <br />
      <Button style={{ padding: '10px' }} onClick={() => throwError('Error 4')}>
        Throw Error 4
      </Button>
      <br />
      <Button style={{ padding: '10px' }} onClick={() => throwError('Error 5')}>
        Throw Error 5
      </Button>
      <br />
    </div>
  );
};

export default ErrorTestingPage;
