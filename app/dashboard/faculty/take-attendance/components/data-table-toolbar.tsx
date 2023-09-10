'use client';

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

  const isFiltered = table.getState().columnFilters.length > 0;
  const attendanceTypes = zAttendanceStatus.options.map((status) => ({
    label: ` ${formatString(status)}`,
    value: status,
    icon: zAttendanceStatusIcons[status]
  }));

  const statuses: StatusType[] = attendanceTypes;

  statuses.push({
    label: 'Absent',
    value: 'absent',
    icon: () => <CrossCircledIcon className="mr-1 text-destructive " />
  });

  //  absent: () => <CrossCircledIcon className="text-destructive" />,
  //  absent: () => <CrossCircledIcon className="text-destructive" />,
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
        {table.getColumn('status') && (
          <DataTableFacetedFilter
            column={table.getColumn('status')}
            title="Status"
            options={statuses}
          />
        )}
        <AttendanceButtons />
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
      </div>
      <CalendarDateRangePicker className="mr-2" />
      <DataTableViewOptions table={table} />
    </div>
  );
}
