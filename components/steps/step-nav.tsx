import { Button } from '@/components/ui/button';
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const StepButton = ({
  step,
  numSteps,
  currentStep
}: {
  step: number;
  numSteps: number;
  currentStep: number;
}) => {
  const stepPassed = () => {
    return currentStep > step;
  };

  const selected = () => {
    return step === currentStep;
  };

  const lastStep = () => {
    return step === numSteps - 1;
  };

  return (
    <>
      <div>
        <Link
          href={step.toString()}
          style={{
            pointerEvents: !stepPassed() ? 'none' : 'auto'
          }}
        >
          <Button
            variant={
              selected() ? 'secondary' : stepPassed() ? 'default' : 'ghost'
            }
            size="icon"
            className={''}
            disabled={!stepPassed()}
          >
            {stepPassed() ? (
              <CheckCircledIcon className="w-5 h-5" />
            ) : (
              <CircleIcon className="w-5 h-5" />
            )}
          </Button>
        </Link>
      </div>
      {!lastStep() && (
        <hr
          className={`w-full h-1 mx-auto my-4  border-0 rounded md:my-10 ${
            stepPassed() ? 'bg-primary' : 'bg-secondary'
          }`}
        />
      )}
    </>
  );
};

export default StepButton;
