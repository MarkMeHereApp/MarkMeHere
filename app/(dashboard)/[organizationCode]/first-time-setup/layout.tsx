import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StepButton from './components/step-nav';
import prisma from '@/prisma';
import { MinusIcon } from '@radix-ui/react-icons';

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
            <StepButton step={1} organizationCode={params.organizationCode} />
            <StepButton step={2} organizationCode={params.organizationCode} />
            <StepButton
              step={3}
              organizationCode={params.organizationCode}
              lastStep={true}
            />
          </div>
          {children}
        </CardHeader>
      </Card>
    </div>
  );
}
