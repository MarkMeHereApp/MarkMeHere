'use client';

import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/app/dashboard/faculty/take-attendance/components/data-table-view-options';
import { CrossCircledIcon } from '@radix-ui/react-icons';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import AttendanceButtons from '../AttendanceButtons';
import { CalendarDateRangePicker } from '@/app/dashboard/faculty/components/date-picker';
import {
  zAttendanceStatus,
  zAttendanceStatusIcons,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';
import { toast } from '@/components/ui/use-toast';
import { useCourseContext } from '@/app/course-context';
import { useLecturesContext } from '../../lecture-context';
import { trpc } from '@/app/_trpc/client';
import { CourseMember } from '@prisma/client';
import { AttendanceEntry } from '@prisma/client';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  type StatusType = {
    label: string;
    value: zAttendanceStatusType | 'absent';
    icon: React.ComponentType;
  };
  const { selectedAttendanceDate } = useCourseContext();
  const { lectures, setLectures } = useLecturesContext();

  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected = table.getIsAllRowsSelected() || table.getIsSomeRowsSelected();
  const globalFilter = table.getState().globalFilter;
  const attendanceTypes = zAttendanceStatus.options.map((status) => ({
    label: ` ${formatString(status)}`,
    value: status,
    icon: zAttendanceStatusIcons[status]
  }));

  const getCurrentLecture = () => {
    if (lectures) {
        return lectures.find((lecture) => {
            return (
            lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
            );
        });
    }
  };

  const [attendanceEntries, setAttendanceEntries] = React.useState<AttendanceEntry[]>(getCurrentLecture()?.attendanceEntries || []);

  const statuses: StatusType[] = attendanceTypes;

  statuses.push({
    label: 'Absent',
    value: 'absent',
    icon: () => <CrossCircledIcon className="mr-1 text-destructive " />
  });

  const createNewAttendanceEntryMutation = trpc.attendance.createManyAttendanceRecords.useMutation();

  const handleCreateNewAttendanceEntries = async (status: string) => {
    const lecture = getCurrentLecture();
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    const courseMemberIds = selectedCourseMembers.map((member) => member.id);
    if (lectures && lecture) {
        try {
            const updatedEntries = await createNewAttendanceEntryMutation.mutateAsync({
                lectureId: lecture.id,
                attendanceStatus: status,
                courseMemberIds: courseMemberIds
            });
            
            if (updatedEntries.updatedAttendanceEntries) {
                setAttendanceEntries(() => updatedEntries.updatedAttendanceEntries);
            
                table.resetRowSelection();
            
            
                // Update only the lecture that corresponds to the created entry
                const updatedLectures = lectures.map((curLecture) =>
                curLecture.id === lecture.id
                    ? { ...curLecture, attendanceEntries: updatedEntries.updatedAttendanceEntries }
                    : curLecture
                );
                setLectures(updatedLectures);

                const selectedNames = selectedCourseMembers.map((member) => member.name);

                toast({
                    title: `Created ${selectedCourseMembers.length} New Attendance Entries!`,
                    description: `Successfully marked ${selectedNames} ${status} for ${selectedAttendanceDate.toISOString().split('T')[0]}`,
                    icon: 'success'
                });
        };
        } catch (error) {
            throw error;
        }
    }
  };

  const deleteAttendanceEntryMutation = trpc.attendance.deleteLectureAttendanceEntries.useMutation();

  const handleDeleteEntriesMutation = async () => {
    const lecture = getCurrentLecture();
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    const courseMemberIds = selectedCourseMembers.map((member) => member.id);
    if (lectures && lecture) {
        try {
            await deleteAttendanceEntryMutation.mutateAsync({
                lectureId: lecture.id,
                courseMemberIds: courseMemberIds
            });
            
            const updatedLecture = {
                ...lecture,
                attendanceEntries: lecture.attendanceEntries.filter(
                  (entry) => !courseMemberIds.includes(entry.courseMemberId)
                ),
            };
            table.resetRowSelection();
            setAttendanceEntries(updatedLecture.attendanceEntries);

            const updatedLectures = lectures.map((curLecture) =>
                curLecture.id === lecture.id
                    ? updatedLecture 
                    : curLecture
            );
            setLectures(updatedLectures);
            
            const selectedNames = selectedCourseMembers.map((member) => member.name);

            toast({
                title: `Deleted ${selectedCourseMembers.length} Attendance Entries!`,
                description: `Successfully marked ${selectedNames} absent for ${selectedAttendanceDate.toISOString().split('T')[0]}`,
                icon: 'success'
             });
        } catch (error) {
            throw error;
        }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search for a student..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableViewOptions table={table} />
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isSelected && (
            <>
                <AttendanceButtons status="Mark Present" onClick={() => handleCreateNewAttendanceEntries('here')} />
                <AttendanceButtons status="Mark Late" onClick={() => handleCreateNewAttendanceEntries('late')} />
                <AttendanceButtons status="Mark Excused" onClick={() => handleCreateNewAttendanceEntries('excused')} />
                <AttendanceButtons status="Mark Absent" onClick={() => handleDeleteEntriesMutation()} />
            </>
        )}
      </div>
      <CalendarDateRangePicker />
    </div>
  );
}
