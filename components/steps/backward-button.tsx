import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const BackwardButton = ({ currentStep }: { currentStep: number }) => {
  return (
    <>
      <Link href={(currentStep - 1).toString()}>
        <Button variant={'outline'}>Go Back</Button>
      </Link>
    </>
  );
};
export default BackwardButton;
