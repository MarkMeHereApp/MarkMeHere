'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Student } from '@/utils/sharedTypes';

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'dateCreated',
    header: 'Enrollment Date'
  }
];
