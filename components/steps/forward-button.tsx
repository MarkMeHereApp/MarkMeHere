import Link from 'next/link';
import { ContinueButton } from '@/components/general/continue-button';

export const ForwardButton = ({
  currentStep,
  disabled,
  text = 'Next'
}: {
  currentStep: number;
  disabled?: boolean;
  text?: string;
}) => {
  return (
    <>
      <Link
        href={(currentStep + 1).toString()}
        style={{
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <ContinueButton disabled={disabled} name={text} />
      </Link>
    </>
  );
};

export default ForwardButton;
