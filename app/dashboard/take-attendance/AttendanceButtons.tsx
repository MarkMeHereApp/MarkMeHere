import { Button } from '@/components/ui/button';

const MarkPresentButton = () => {
  return (
    <Button variant="outline" size="sm" className="h-8">
      Mark Present
    </Button>
  );
};

const MarkAbsentButton = () => {
  return (
    <Button variant="outline" size="sm" className="h-8">
      Mark Absent
    </Button>
  );
};

const MarkLateButton = () => {
  return (
    <Button variant="outline" size="sm" className="h-8">
      Mark Late
    </Button>
  );
};

const MarkExcusedButton = () => {
  return (
    <Button variant="outline" size="sm" className="h-8">
      Mark Excused
    </Button>
  );
};

const AttendanceButtons = () => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      <MarkPresentButton />
      <MarkAbsentButton />
      <MarkLateButton />
      <MarkExcusedButton />
    </div>
  );
};

export default AttendanceButtons;
