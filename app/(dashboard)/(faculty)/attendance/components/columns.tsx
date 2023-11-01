'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from './data-table-column-header';
import {
  zAttendanceStatus,
  ExtendedCourseMember,
  zAttendanceStatusIcons
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';
import { DataTableRowActions } from './data-table-row-actions';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export const columns: ColumnDef<ExtendedCourseMember>[] = [
  {
    id: 'id',
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const curName: string = row.getValue('name');
      if (curName.length > 13) {
        const truncatedName = `${curName.substring(0, 13)}...`;
        return <div className="flex w-full">{truncatedName}</div>
      }
      return <div className="flex w-full">{curName}</div>
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'mark Status',
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="Mark Status" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: true
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
            <QuestionMarkCircledIcon />
            <span className="ml-1">Unmarked</span>
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

      if (value.includes('unmarked')) {
        return status === undefined;
      }

      return value.includes(status);
    },
    enableSorting: false,
    enableHiding: true
  }, 
  {
    accessorKey: 'date marked',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Marked" />
    ),
    cell: ({ row }) => {
      const originalValue = row.original as ExtendedCourseMember;
      const dateMarked = originalValue.AttendanceEntry
        ? originalValue.AttendanceEntry.dateMarked
        : undefined;

      if (!dateMarked) {
        return <div className="flex w-full">No Data</div>;
      }
      const formattedDate = dateMarked.toLocaleDateString();
      return <div className="flex w-full">{formattedDate}</div>;
    },
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
  }
];
