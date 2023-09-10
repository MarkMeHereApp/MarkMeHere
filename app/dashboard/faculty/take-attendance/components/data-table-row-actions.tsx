import { toast } from '@/components/ui/use-toast';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { CourseMember } from '@prisma/client';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { 
    ClockIcon, 
    CheckCircledIcon,
    CrossCircledIcon,
    CircleIcon
} from '@radix-ui/react-icons';
import { useLecturesContext } from '@/app/dashboard/faculty/lecture-context';
import { AttendanceEntry } from '@prisma/client';
import * as React from 'react';


interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { lectures, setLectures } = useLecturesContext();
  const { courseMembersOfSelectedCourse, selectedCourseId, selectedAttendanceDate } = useCourseContext();

  // Get the course member data of a selected row for one student
  const courseMemberData = row.original as CourseMember;

  const getCurrentLecture = () => {
    if (lectures) {
    return lectures.find((lecture) => {
        return (
        lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
    });
    }
  };

  const [selectedLecture, setSelectedLecture] = React.useState(getCurrentLecture() || undefined);
  const [attendanceEntries, setAttendanceEntries] = React.useState<AttendanceEntry[]>(getCurrentLecture()?.attendanceEntries || []);

  const createNewAttendanceEntryMutation = trpc.attendance.createManyAttendanceRecords.useMutation();
  async function handleCreateNewAttendanceEntry(status: string) {
    // const lecture = getCurrentLecture();
    if (selectedLecture) {
        await createNewAttendanceEntryMutation.mutateAsync({
            lectureId: selectedLecture.id,
            attendanceStatus: status,
            courseMemberIds: [courseMemberData.id]
          });
          if (createNewAttendanceEntryMutation.data) {
            setAttendanceEntries(createNewAttendanceEntryMutation.data.updatedAttendanceEntries);
          }
          toast({
            title: 'Created New Attendance Entry!',
            description: `Successfully marked ${courseMemberData.name} ${status} for ${selectedAttendanceDate.toDateString()}`,
            icon: 'success'
          });
    }
  }

  // Only for absent students -> absent == no attendance entry
  async function handleDeleteAttendanceEntry() {
    // const lecture = getCurrentLecture();
    if (selectedLecture) {
        const updatedAttendanceEntries = attendanceEntries.filter(
            (entry) => entry.courseMemberId !== courseMemberData.id
          );
          setAttendanceEntries(updatedAttendanceEntries);
           toast({
            title: 'Created New Attendance Entry!',
            description: `Successfully marked ${courseMemberData.name} absent for ${selectedAttendanceDate.toDateString()}`,
            icon: 'success'
          });
    }
  };

//     useEffect(() => {
//         if (lectures) {
//             // We need this to refetch the attendance entries when a new attendance entry for a lecture is created
//             // const currentLecture = getCurrentLecture();
//             if (!selectedLecture) return;

//             const updatedLectures = lectures.map((lecture) => {
//                 // Check if the lecture matches the lectureId you want to update
//                 if (lecture.id === selectedLecture.id) {
//                     const updatedLecture = { ...selectedLecture, attendanceEntries: attendanceEntries };
//                     return updatedLecture;
//                 }
//                 return lecture; // Return unchanged lectures
//             });
//             setLectures(updatedLectures);
//         }
//   }, []);
    
  return (
    <div className='flex space-x-4'>    
        <div onClick={() => {handleCreateNewAttendanceEntry('here')}}>
            <CheckCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
        </div>
        <div onClick={() => {handleCreateNewAttendanceEntry('late')}}>
            <ClockIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
        </div>
        <div onClick={() => {handleCreateNewAttendanceEntry('excused')}}>
            <CircleIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
        </div>
        <div onClick={() => {handleDeleteAttendanceEntry()}}>
            <CrossCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
        </div>
    </div>
  );
}

