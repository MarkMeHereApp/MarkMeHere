import { lecturesType } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CourseMember } from '@prisma/client';
import { saveAs } from 'file-saver';
import { CalendarDateRangePicker } from './date-rangepicker';
import { useSelectedLectureContext } from '../../components/context-selected-lectures';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import calculateCourseMemberStatistics from '../utils/calculateCourseMemberStatistics';
import { SyncCanvasGrade } from '@/utils/devUtilsComponents/SyncCanvasGrade';

export interface OverviewBarProps {
  selectedCourseName: string;
  lectures: lecturesType;
  courseMembers: CourseMember[] | null;
}

const countAttendanceStatus = (
  status: string,
  member: CourseMember,
  givenLectures: lecturesType
) => {
  if (!givenLectures || givenLectures.length === 0) {
    return 0;
  }
  let count = 0;
  givenLectures.forEach((lecture) => {
    lecture.attendanceEntries.forEach((entry) => {
      if (entry.status === status && entry.courseMemberId === member.id) {
        count++;
      }
    });
  });
  return count;
};

const OverviewBar: React.FC<OverviewBarProps> = ({
  selectedCourseName,
  lectures,
  courseMembers
}) => {
  if (!lectures || lectures?.length === 0) {
    return null;
  }
  const sortedLectures = lectures.sort((a, b) => {
    return a.lectureDate > b.lectureDate ? 1 : -1;
  });

  const exportData = {
    lectures: sortedLectures,
    courseMembers: courseMembers
  };

  const { selectedDateRange } = useSelectedLectureContext();

  const onClickExportJSON = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, selectedCourseName + 'Data.json');
  };

  const onClickExportCSV = () => {
    const csvData = [
      [
        'Name',
        'Email',
        'LMS ID',
        'Optional ID',
        'Date Enrolled',
        'Role',
        'Present Entries',
        'Excused Entries',
        'Late Entries',
        'Absent Entries',
        'Total Entries',
        'Attendance Grade',
        'Number of Lectures in Date Range'
      ]
    ];
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

      const encapsulateField = (field: string) => `"${field}"`;

      csvData.push([
        encapsulateField(member.name),
        encapsulateField(member.email),
        encapsulateField(member.lmsId ?? ''),
        encapsulateField(member.optionalId ?? ''),
        encapsulateField(member.dateEnrolled.toLocaleDateString()),
        encapsulateField(member.role),
        numPresent.toString(),
        numExcused.toString(),
        numLate.toString(),
        numAbsent.toString(),
        numTotal.toString(),
        attendanceGrade.toString(),
        sortedLectures.length.toString()
      ]);
    });

    const csv = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(
      blob,
      selectedCourseName +
        ' ' +
        selectedDateRange.from?.toLocaleDateString() +
        '-' +
        selectedDateRange.to?.toLocaleDateString() +
        '.csv'
    );
  };

  return (
    <>
      <Card>
        <CardContent className="flex flex-col sm:flex-row p-4 gap-4">
          <CalendarDateRangePicker className="w-full sm:w-auto" />
          <Button
            className="w-full sm:w-auto"
            onClick={() => onClickExportJSON()}
          >
            Export to JSON
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => onClickExportCSV()}
          >
            Export to CSV
          </Button>
          <SyncCanvasGrade
            className="w-full sm:w-auto"
            bShowTextOnSmall={true}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewBar;
