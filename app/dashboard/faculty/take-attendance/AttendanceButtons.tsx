import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';

// Create a new attendance entry for a selected student
const createAttendanceEntry = () => {
    const attendanceEntryMutation = trpc.attendance.updateSelectedCourseId.useMutation();
    
    async function handleCreateAttendanceEntry(attendanceStatus: string) {
    await attendanceEntryMutation.mutateAsync(
        {
            lectureId: '',
            courseMemberId: '',
            attendanceStatus: '',
            returnAllAttendanceEntries: true
        });
        toast({
            title: `Successfully marked student(s) as ${attendanceStatus}`
        });
    };
};


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
