'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import the useRouter hook

const StepButton = ({
  step,
  organizationCode,
  lastStep
}: {
  step: number;
  organizationCode: string;
  lastStep?: boolean;
}) => {
  const pathname = usePathname();

  if (pathname === `/${organizationCode}/first-time-setup`) {
    return <></>;
  }

  //Get the step from the URL
  const currentlySelectedStep = Number(pathname.split('/').pop());

  if (isNaN(currentlySelectedStep)) {
    throw new Error('Current Step is not a number!');
  }

  const stepLink = `${organizationCode}/first-time-setup/${step.toString()}`;

  const stepPassed = () => {
    return currentlySelectedStep > step;
  };

  const selected = () => {
    return step === currentlySelectedStep;
  };

  return (
    <>
      <div>
        <Link href={stepLink}>
          <Button
            variant={selected() ? 'default' : 'ghost'}
            size="icon"
            className={''}
          >
            {stepPassed() ? (
              <CheckCircledIcon className="w-5 h-5" />
            ) : (
              <CircleIcon className="w-5 h-5" />
            )}
          </Button>
        </Link>
      </div>
      {!lastStep && (
        <hr
          className={`w-48 h-1 mx-auto my-4  border-0 rounded md:my-10 ${
            stepPassed() ? 'bg-primary' : 'bg-secondary'
          }`}
        />
      )}
    </>
  );
};

export default StepButton;
