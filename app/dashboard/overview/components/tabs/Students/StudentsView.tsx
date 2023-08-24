'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import AttendanceContainer from './AttendancePieChart/AttendanceContainer';
import { Student } from '@/utils/sharedTypes';

interface StudentsViewProps {
  students: Student[];
}

const StudentsView: React.FC<StudentsViewProps> = ({ students }) => {
  return (
    <div className="w-full">
      {/* Adjust the width of the card using Flexbox */}
      <Card className="flex-grow w-1/2">
        {students && (
          <>
            <CardHeader>
              <CardTitle>Student Attendance Statistics</CardTitle>
              <CardDescription>
                Click a student to view their attendance percentage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceContainer students={students} />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default StudentsView;
