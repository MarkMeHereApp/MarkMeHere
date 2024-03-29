'use client';

import * as React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from '@/app/(dashboard)/[organizationCode]/[courseCode]/(faculty)/attendance/components/data-table-view-options';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import AttendanceButtons from '../AttendanceButtons';
import { CalendarDateRangePicker } from '../../components/date-picker';
import {
  zAttendanceStatus,
  zAttendanceStatusIcons,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';
import { toast } from '@/components/ui/use-toast';
import { useLecturesContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
import { trpc } from '@/app/_trpc/client';
import { CourseMember } from '@prisma/client';
import { AttendanceEntry } from '@prisma/client';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  type StatusType = {
    label: string;
    value: zAttendanceStatusType | 'unmarked';
    icon: React.ComponentType;
  };
  const { lectures, setLectures, selectedAttendanceDate } =
    useLecturesContext();

  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected =
    table.getIsAllRowsSelected() || table.getIsSomeRowsSelected();
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

  const [attendanceEntries, setAttendanceEntries] = React.useState<
    AttendanceEntry[]
  >(getCurrentLecture()?.attendanceEntries || []);

  const statuses: StatusType[] = attendanceTypes;

  statuses.push({
    label: 'Unmarked',
    value: 'unmarked',
    icon: () => <QuestionMarkCircledIcon className="mr-1" />
  });

  const createNewAttendanceEntryMutation =
    trpc.attendance.createManyAttendanceRecords.useMutation();

  const handleCreateNewAttendanceEntries = async (
    status: zAttendanceStatusType
  ) => {
    const lecture = getCurrentLecture();
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    const courseMemberIds = selectedCourseMembers.map((member) => member.id);
    if (lectures && lecture) {
      try {
        const updatedEntries =
          await createNewAttendanceEntryMutation.mutateAsync({
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
              ? {
                  ...curLecture,
                  attendanceEntries: updatedEntries.updatedAttendanceEntries
                }
              : curLecture
          );
          setLectures(updatedLectures);

          const selectedNames = selectedCourseMembers.map(
            (member) => member.name
          );

          toast({
            title: `Created ${selectedCourseMembers.length} New Attendance Entries!`,
            description: `Successfully marked ${selectedNames} ${status} for ${
              selectedAttendanceDate.toISOString().split('T')[0]
            }`,
            icon: 'success'
          });
        }
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {getCurrentLecture() && (
          <>
            <Input
              placeholder="Search"
              value={'globalFilter' in table.getState() ? globalFilter : ''}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const searchString = event.target.value;
                table.setGlobalFilter(searchString);
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <div className="hidden sm:flex">
              {isSelected && (
                <>
                  <AttendanceButtons
                    status="Mark Present"
                    onClick={() => handleCreateNewAttendanceEntries('here')}
                  />
                  <AttendanceButtons
                    status="Mark Late"
                    onClick={() => handleCreateNewAttendanceEntries('late')}
                  />
                  <AttendanceButtons
                    status="Mark Excused"
                    onClick={() => handleCreateNewAttendanceEntries('excused')}
                  />
                  <AttendanceButtons
                    status="Mark Absent"
                    onClick={() => handleCreateNewAttendanceEntries('absent')}
                  />
                </>
              )}
            </div>
            <DataTableViewOptions table={table} />
            <div className="hidden sm:flex">
              {table.getColumn('status') && (
                <DataTableFacetedFilter
                  column={table.getColumn('status')}
                  title="Status"
                  options={statuses}
                />
              )}
            </div>
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
          </>
        )}
      </div>
      <div className="ml-2">
        <CalendarDateRangePicker />
      </div>
    </div>
  );
}
