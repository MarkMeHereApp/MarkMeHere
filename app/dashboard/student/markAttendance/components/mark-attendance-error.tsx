import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { firaSansFont } from '@/utils/fonts';

interface ErrorMessageProps {
  message: string;
}

const MarkAttendanceError: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Card className="w-[400px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
      <CardContent>
        <div className="flex flex-col space-y-2 text-center p-3 pb-6">
          <span className={firaSansFont.className}>
            <h1 className={`text-2xl font-bold`}>Error</h1>
          </span>
        </div>
        <div className="grid gap-4">
          <Alert className="text-center text-destructive">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkAttendanceError;
