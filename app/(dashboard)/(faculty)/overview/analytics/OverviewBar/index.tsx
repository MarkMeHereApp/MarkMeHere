import { lecturesType } from '@/app/context-lecture';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CourseMember } from '@prisma/client';
import { saveAs } from 'file-saver';
import { CalendarDateRangePicker } from './date-rangepicker';

export interface OverviewBarProps {
  selectedCourseName: string;
  lectures: lecturesType;
  courseMembers: CourseMember[] | null;
}
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

  const onClickExport = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, selectedCourseName + 'Data.json');
  };

  return (
    <>
      <Card>
        <CardContent className="flex p-4">
          <Button onClick={() => onClickExport()}>Export to JSON</Button>
          <CalendarDateRangePicker />
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewBar;
