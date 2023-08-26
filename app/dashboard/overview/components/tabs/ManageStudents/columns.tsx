'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './table-accessories/data-table-column-header';
import { DataTableRowActions } from './table-accessories/data-table-row-actions';
import { Student } from '@/utils/sharedTypes';

export const columns: ColumnDef<Student>[] = [
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
    enableHiding: true
  },
  {
    accessorKey: 'firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => (
      <div className="w-full">{row.getValue('firstName')}</div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div className="w-full">{row.getValue('lastName')}</div>,
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  { accessorKey: 'fullName' }, // This is needed for flexibility when seraching for the full name of a student.
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="w-full">{row.getValue('email')}</div>,
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
