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
          checkInDate: new Date()
        };
        UpdateAttendanceState(newEntry);

        const response = await createNewAttendanceEntryMutation.mutateAsync({
          lectureId: lecture.id,
          attendanceStatus: status,
          courseMemberId: courseMemberData.id
        });

        if (response.attendanceEntry) {
          //AddOrUpdateAttendanceEntry(response.attendanceEntry);  Uncomment this to remove prediction
        }
      } catch (error) {
        setError(error as Error);
      }
    }
  }

  // Only for absent students -> absent == no attendance entry
  const deleteAttendanceEntryMutation =
    trpc.attendance.deleteLectureAttendanceEntries.useMutation();
  async function handleDeleteAttendanceEntry() {
    const lecture = getCurrentLecture();
    if (lectures && lecture) {
      try {
        // Get the updated attendance entries that exclude the absent student entries
        const updatedLecture = {
          ...lecture,
          attendanceEntries: lecture.attendanceEntries.filter(
            (entry) => entry.courseMemberId !== courseMemberData.id
          )
        };
        setAttendanceEntries(updatedLecture.attendanceEntries);

        // Update only the lecture that corresponds to the deleted entry
        const updatedLectures = lectures.map((curLecture) =>
          curLecture.id === lecture.id ? updatedLecture : curLecture
        );
        setLectures(updatedLectures);

        await deleteAttendanceEntryMutation.mutateAsync({
          lectureId: lecture.id,
          courseMemberIds: [courseMemberData.id]
        });
      } catch (error) {
        throw error;
      }
    }
  }

  return (
    <div className="flex space-x-4">
      <div
        onClick={() => {
          handleCreateNewAttendanceEntry('here');
        }}
      >
        <CheckCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        onClick={() => {
          handleCreateNewAttendanceEntry('late');
        }}
      >
        <ClockIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        onClick={() => {
          handleCreateNewAttendanceEntry('excused');
        }}
      >
        <CircleIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
      <div
        onClick={() => {
          handleDeleteAttendanceEntry();
        }}
      >
        <CrossCircledIcon className="h-4 w-4 hover:text-yellow-400 transition-colors hover:cursor-pointer" />
      </div>
    </div>
  );
}
