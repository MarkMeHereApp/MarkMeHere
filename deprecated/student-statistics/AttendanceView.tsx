import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import AttendanceContainer from './AttendancePieChart/AttendanceContainer';

interface StudentsViewProps {
  students: Student[];
}

const AttendanceView: React.FC<StudentsViewProps> = ({ students }) => {
  return (
    <div className="w-full">
      {/* Adjust the width of the card using Flexbox */}
      <Card className="flex-grow w-1/2">
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
      </Card>
    </div>
  );
};

export default AttendanceView;
