import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StepButton from './components/step-nav';
import prisma from '@/prisma';

export default async function CreateNewSchoolLayout({
  children,
  currentStep
}: {
  children: React.ReactNode;
  currentStep: number;
}) {
  const organization = await prisma.organization.findFirst();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[600px]">
        <CardHeader>
          <div className="flex justify-between items-center w-full space-x-4">
            <StepButton
              stepComplete={false}
              url="/create-new-school"
              firstEntry={true}
            />
            {/*<Separator />*/}
            <StepButton stepComplete={true} url="/test" />
            {/*<Separator />*/}
            <StepButton stepComplete={false} url="/test2" lastEntry={true} />
          </div>
          <CardDescription className="text-lg">{children}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
