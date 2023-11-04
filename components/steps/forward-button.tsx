import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';

export const ForwardButton = ({ currentStep }: { currentStep: number }) => {
  return (
    <>
      <Link href={(currentStep + 1).toString()}>
        <ContinueButton name="Next" />
      </Link>
    </>
  );
};

export default ForwardButton;
