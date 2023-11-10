import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { CourseMember } from '@prisma/client';
import { lecturesType } from '../../../../context-lecture';
import calculateCourseMemberStatistics from '../utils/calculateCourseMemberStatistics';

export interface SupportListProps {
  selectedCourseName: string;
  lectures: lecturesType;
  courseMembers: CourseMember[] | null;
}

const SupportList: React.FC<SupportListProps> = ({
  lectures,
  courseMembers
}) => {
  if (!lectures || lectures?.length === 0) {
    return null;
  }
  // Initialize an empty map to hold student objects with member.id as keys
  const studentMap = new Map();

  courseMembers?.forEach((member) => {
    const courseMemberStatistics = calculateCourseMemberStatistics(
      member,
      lectures
    );
    const {
      numPresent,
      numAbsent,
      numLate,
      numExcused,
      numTotal,
      attendanceGrade
    } = courseMemberStatistics;

    // Use member.id as key and store the rest of the information as an object
    studentMap.set(member.id, {
      id: member.id,
      name: member.name,
      email: member.email,
      lmsId: member.lmsId ?? '',
      optionalId: member.optionalId ?? '',
      dateEnrolled: member.dateEnrolled.toLocaleDateString(),
      role: member.role,
      numPresent: numPresent.toString(),
      numExcused: numExcused.toString(),
      numLate: numLate.toString(),
      numAbsent: numAbsent.toString(),
      numTotal: numTotal.toString(),
      attendanceGrade: attendanceGrade,
      totalLectures: lectures.length.toString()
    });
  });

  // Convert the map to an array of values and sort by the attendance ratio
  const sortedStudents = Array.from(studentMap.values()).sort(
    (a, b) => a.attendanceGrade - b.attendanceGrade
  );

  // Get the first 5 students, or fewer if there are not enough
  const topStudents = sortedStudents.slice(0, 5);

  // Dynamically create a div for each top student with TailwindCSS classes
  const studentCards = topStudents.map((student) => (
    <div
      key="{student.id}"
      className="shadow rounded-lg p-4 flex items-center justify-between bg-card text-foreground border-border"
    >
      <div className="flex flex-col">
        <div className="font-semibold truncate text-secondary-foreground overflow-hidden whitespace-nowrap text-overflow-ellipsis">
          {student.name}
        </div>
        <div className="text-xs text-muted-foreground overflow-hidden whitespace-nowrap text-overflow-ellipsis">
          {student.email}
        </div>
      </div>
      <div className="text-sm font-medium text-secondary-foreground">
        {(100 * student.attendanceGrade).toFixed(2) + '%'}
      </div>
    </div>
  ));

  return (
    <Card className="h-full">
      <CardHeader className="-mb-8">
        <CardTitle>Attendance Support List</CardTitle>
        <CardDescription>
          These students may be in need of support.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full space-y-2 p-4 ">
        {studentCards}
      </CardContent>
    </Card>
  );
};

export default SupportList;
