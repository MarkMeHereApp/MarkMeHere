import { lecturesType } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Course, CourseMember } from '@prisma/client';
import { saveAs } from 'file-saver';
import { CalendarDateRangePicker } from './date-rangepicker';
import { number } from 'zod';
import { useSelectedLectureContext } from '../../components/context-selected-lectures';

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
        'Attendance Rate',
        'Number of Lectures in Date Range'
      ]
    ];
    courseMembers?.forEach((member) => {
      const numPresent = countAttendanceStatus('here', member, lectures);
      const numAbsent = countAttendanceStatus('absent', member, lectures);
      const numLate = countAttendanceStatus('late', member, lectures);
      const numExcused = countAttendanceStatus('excused', member, lectures);
      const numTotal = numPresent + numAbsent + numLate + numExcused;
      csvData.push([
        member.name,
        member.email,
        member.lmsId ?? '',
        member.optionalId ?? '',
        member.dateEnrolled.toLocaleDateString(),
        member.role,
        numPresent.toString(),
        numExcused.toString(),
        numLate.toString(),
        numAbsent.toString(),
        numTotal.toString(),
        (numPresent / numTotal).toString(),
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
        <CardContent className="flex p-4 gap-4">
          <CalendarDateRangePicker />
          <Button onClick={() => onClickExportJSON()}>Export to JSON</Button>
          <Button onClick={() => onClickExportCSV()}>Export to CSV</Button>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewBar;
