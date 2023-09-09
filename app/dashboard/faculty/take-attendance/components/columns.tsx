'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import { Icons } from '@/components/ui/icons';
import {
  CrossCircledIcon,
  CheckCircledIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { AttendanceEntry, CourseMember } from '@prisma/client';
import {
  zAttendanceStatus,
  zAttendanceStatusType,
  ExtendedCourseMember,
  zAttendanceStatusIcons
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';

export const columns: ColumnDef<ExtendedCourseMember>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Canvas ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full">{row.getValue('name')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full">{row.getValue('email')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const originalValue = row.original as ExtendedCourseMember;
      const status = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.status
        : undefined;

      if (!status) {
        return (
          <div className="flex w-[100px] items-center">
            <CrossCircledIcon className="text-destructive" />
            <span className="ml-1">Absent</span>
          </div>
        );
      }

      try {
        const statusAsZod = zAttendanceStatus.parse(status);
        const IconComponent = zAttendanceStatusIcons[statusAsZod];

        return (
          <div className="flex w-[100px] items-center">
            <>
              <IconComponent />

              <span>{formatString(statusAsZod)}</span>
            </>
          </div>
        );
      } catch (e) {
        throw new Error(`Invalid attendance status: ${status}`);
      }
    },
    filterFn: (row, id, value) => {
      const originalValue = row.original as ExtendedCourseMember;
      const status = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.status
        : undefined;

      if (value.includes('absent')) {
        return status === undefined;
      }

      return value.includes(status);
    }
  }
];
