import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

const TopStudents = () => {
  return (
    <Card className="h-full">
      <CardContent className="flex flex-col h-full space-y-2 p-4">
        <Card className="flex-grow">First Student</Card>
        <Card className="flex-grow">Second</Card>
        <Card className="flex-grow">Third</Card>
        <Card className="flex-grow">Fourth</Card>
        <Card className="flex-grow">Fifth</Card>
      </CardContent>
    </Card>
  );
};

export default TopStudents;
