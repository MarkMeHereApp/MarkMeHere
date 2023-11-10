'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './table-accessories/DataTableColumnHeader';
import { CourseMember } from '@prisma/client';
import { capitalize } from 'lodash';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import StudentPageBoard from '../../(student)/student/StudentPageBoard';
import EditCourseMember from '@/utils/devUtilsComponents/EditCourseMember';

export const columns: ColumnDef<CourseMember>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const curName: string = row.getValue('name');
      if (curName.length > 13) {
        const truncatedName = `${curName.substring(0, 13)}...`;
        return <div className="flex w-full">{truncatedName}</div>;
      }
      return <div className="flex w-full">{curName}</div>;
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
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <div className="flex w-full">{capitalize(row.getValue('role'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: true,
    enableHiding: true,
    enableGlobalFilter: true
  },
  {
    accessorKey: 'view Stats',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className='pl-1' title="Statistics" />
    ),
    cell: ({ row }) => {
        const id = row.original.id;
        const role = row.original.role;
        return (role === 'student') && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' size='xs' className='pl-2 pr-2'>View Stats</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[1300px] h-full">
                <div className='grid gap-4 py-4'>
                    <StudentPageBoard studentId={id} />
                </div>
              </DialogContent>
          </Dialog>
        ); 
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'edit',
    cell: ({ row }) => <EditCourseMember courseMember={row.original} />,
    enableSorting: false,
    enableHiding: false
  }
];
