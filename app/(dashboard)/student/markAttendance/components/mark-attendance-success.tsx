import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { firaSansFont } from '@/utils/fonts';
import { CheckCircledIcon } from '@radix-ui/react-icons';

interface ErrorMessageProps {
  dateMarked: Date;
}

const MarkAttendanceSuccess: React.FC<ErrorMessageProps> = ({ dateMarked }) => {
  return (
    <Card className="w-[450px] mx-auto absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4">
      <CardContent>
        <div className="flex flex-col space-y-2 text-center p-3 pb-6">
          <span className={firaSansFont.className}>
            <h1 className={`text-2xl font-bold`}>You Have Been Marked Here!</h1>
          </span>
        </div>
        <div className="grid gap-4">
          <Alert className="text-center">
            <AlertDescription>
              <CheckCircledIcon className="inline-block w-6 h-6 mr-2 text-primary" />
              Checked in{' '}
              {dateMarked.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkAttendanceSuccess;
