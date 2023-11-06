import { StepLayout } from '@/components/steps/step-layout';

import { FirstTimeSteps } from './components/first-time-steps';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProviderContext } from '@/app/context-auth-provider';

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
    </StepLayout>
  );
}
