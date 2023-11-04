import { StepLayout } from '@/components/steps/step-layout';
import { ForwardButton } from '@/components/steps/forward-button';
import { BackwardButton } from '@/components/steps/backward-button';

import { FirstTimeSteps } from './components/first-time-steps';
import { FinishSetupButton } from './components/finish-setup-button';

export default async function CreateNewSchoolLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { step: string };
}) {
  return (
    <StepLayout
      currentStep={Number(params.step)}
      numSteps={FirstTimeSteps.length}
    >
      {children}
      <div className="flex justify-end py-4">
        {Number(params.step) !== 0 && (
          <BackwardButton currentStep={Number(params.step)} />
        )}
        <div className="ml-auto">
          {Number(params.step) === FirstTimeSteps.length - 1 ? (
            <FinishSetupButton />
          ) : (
            <ForwardButton currentStep={Number(params.step)} />
          )}
        </div>
      </div>
    </StepLayout>
  );
}
