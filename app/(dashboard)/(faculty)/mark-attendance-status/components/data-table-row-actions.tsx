import { Row } from '@tanstack/react-table';
import { CourseMember } from '@prisma/client';
import { useCourseContext } from '@/app/context-course';
import { trpc } from '@/app/_trpc/client';
import {
  zAttendanceStatus,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import {
  ClockIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  CircleIcon
} from '@radix-ui/react-icons';
import { useLecturesContext } from '@/app/context-lecture';
import { AttendanceEntry } from '@prisma/client';
import * as React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { zAttendanceStatusIconsNotFun } from '@/types/sharedZodTypes';

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

  // Find the attendance entry for this student
  const studentAttendanceEntry = attendanceEntries.find(
    (entry) => entry.courseMemberId === courseMemberData.id
  );

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
            setAttendanceEntries(curLecture.attendanceEntries);
          }
        }
        return curLecture;
      });
      setLectures(updatedLectures);
    }
  };

  const getAttendanceState = (): string | undefined => {
    const currentLecture = lectures?.find(
      (lecture) =>
        lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
    );
    const currentAttendanceEntry = currentLecture?.attendanceEntries.find(
      (entry) => entry.courseMemberId === courseMemberData.id
    );
    return currentAttendanceEntry?.status;
  };

  async function handleCreateNewAttendanceEntry(status: zAttendanceStatusType) {
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
      {zAttendanceStatus.options.map((value) => {
        const Icon = zAttendanceStatusIconsNotFun[value];
        return (
          <Toggle
            className={
              value === 'absent'
                ? 'data-[state=on]:bg-destructive'
                : 'data-[state=on]:bg-primary'
            }
            title={`Mark ${value}`}
            onClick={() => handleCreateNewAttendanceEntry(value)}
            pressed={getAttendanceState() === value}
            variant={'outline'}
            size="sm"
            key={value}
          >
            <Icon
              className={
                getAttendanceState() === value
                  ? value === 'absent'
                    ? 'text-destructive-foreground stroke-current stroke-1 w-4 h-4'
                    : 'text-primary-foreground stroke-current stroke-1 w-4 h-4'
                  : ''
              }
            />
          </Toggle>
        );
      })}
    </div>
  );
}
