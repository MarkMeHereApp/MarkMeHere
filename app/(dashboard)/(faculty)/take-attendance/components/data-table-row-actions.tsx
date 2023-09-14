import { Row } from '@tanstack/react-table';
import { CourseMember } from '@prisma/client';
import { useCourseContext } from '@/app/context-course';
import { trpc } from '@/app/_trpc/client';
import {
  ClockIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  CircleIcon
} from '@radix-ui/react-icons';
import { useLecturesContext } from '@/app/context-lecture';
import { AttendanceEntry } from '@prisma/client';
import * as React from 'react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const { lectures, setLectures } = useLecturesContext();
  const { selectedAttendanceDate } = useCourseContext();

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

  const [attendanceEntries, setAttendanceEntries] = React.useState<
    AttendanceEntry[]
  >(getCurrentLecture()?.attendanceEntries || []);

  const createNewAttendanceEntryMutation =
    trpc.attendance.createOrUpdateSingleAttendanceEntry.useMutation();
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  const UpdateAttendanceState = (newEntry: AttendanceEntry): void => {
    if (lectures) {
      const updatedLectures = lectures.map((curLecture) => {
        if (curLecture.id === newEntry.lectureId) {
          const existingEntryIndex = curLecture.attendanceEntries.findIndex(
            (entry) => entry.courseMemberId === newEntry.courseMemberId
          );
          if (existingEntryIndex !== -1) {
            // Replace the existing attendance entry
            curLecture.attendanceEntries[existingEntryIndex] = newEntry;
          } else {
            // Add the new attendance entry
            curLecture.attendanceEntries.push(newEntry);
          }
        }
        return curLecture;
      });
      setLectures(updatedLectures);
    }
  };

  async function handleCreateNewAttendanceEntry(status: string) {
    const lecture = getCurrentLecture();
    if (lectures && lecture) {
      try {
        const newEntry: AttendanceEntry = {
          id: 'predicted',
          status: status,
          courseMemberId: courseMemberData.id,
          lectureId: lecture.id,
          dateMarked: new Date()
        };

        //We should update the state here for responsiveness
        // But if the lecture context useQuery is not yet finished during a refetch,
        // the state will be overwritten by the fetched data
        // Which will cause the wrong entry to be displayed

        //UpdateAttendanceState(newEntry);

        const response = await createNewAttendanceEntryMutation.mutateAsync({
          lectureId: lecture.id,
          attendanceStatus: status,
          courseMemberId: courseMemberData.id
        });

        if (response.attendanceEntry) {
          UpdateAttendanceState(response.attendanceEntry);
        }
      } catch (error) {
        setError(error as Error);
      }
    }
  }

  return (
    <div className="flex space-x-6">
      <div
        title="Mark Here"
        onClick={() => {
          handleCreateNewAttendanceEntry('here');
        }}
      >
        <CheckCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        title="Mark Late"
        onClick={() => {
          handleCreateNewAttendanceEntry('late');
        }}
      >
        <ClockIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        title="Mark Excused"
        onClick={() => {
          handleCreateNewAttendanceEntry('excused');
        }}
      >
        <CircleIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        title="Mark Absent"
        onClick={() => {
            handleCreateNewAttendanceEntry('absent');
        }}
      >
        <CrossCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
    </div>
  );
}
