import { Card, CardHeader } from '@/components/ui/card';
import StepButton from './components/step-nav';
import { steps } from './components/steps';

export default async function CreateNewSchoolLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { organizationCode: string };
}) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[600px]">
        <CardHeader>
          <div className="flex justify-between items-center w-full space-x-4">
            {steps.map((step, index) => (
              <StepButton
                key={index}
                step={index}
                organizationCode={params.organizationCode}
                lastStep={index === steps.length - 1}
              />
            ))}
          </div>
          {children}
        </CardHeader>
      </Card>
    </div>
  );
}
