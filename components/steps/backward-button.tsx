import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const BackwardButton = ({
  currentStep,
  disabled
}: {
  currentStep: number;
  disabled?: boolean;
}) => {
  return (
    <>
      <Link
        href={(currentStep - 1).toString()}
        style={{
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <Button disabled={disabled} variant={'outline'}>
          Go Back
        </Button>
      </Link>
    </>
  );
};
export default BackwardButton;
