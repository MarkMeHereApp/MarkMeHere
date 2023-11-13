import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import StepButton from './step-nav';
export function StepLayout({
  children,
  currentStep,
  numSteps
}: {
  children: React.ReactNode;
  currentStep: number;
  numSteps: number;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="sm:w-full md:w-[90v] lg:w-[850px] ">
        <CardHeader>
          <div className="flex justify-between items-center w-full space-x-4">
            {Array.from({ length: numSteps }, (_, index) => (
              <StepButton
                key={index}
                step={index}
                currentStep={currentStep}
                numSteps={numSteps}
              />
            ))}
          </div>
          {children}
        </CardHeader>
      </Card>
    </div>
  );
}
