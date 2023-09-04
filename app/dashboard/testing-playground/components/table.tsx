'use client';

import * as React from 'react';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useCourseContext } from '@/app/course-context';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { ScrollArea } from '@/components/ui/scroll-area';

export function DataTable(props: { data: string[][] }) {
  let data = [];
  data = props.data;
  const courseID = useCourseContext().selectedCourseId;
  //   const role = useCourseContext().
  console.log('fasf' + courseID);
  return (
    <ScrollArea className="h-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">LMS ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((d) => (
            <TableRow key={d[0]}>
              <TableCell className="font-medium">{d[0]}</TableCell>
              <TableCell className="font-medium">{d[1]}</TableCell>
              <TableCell className="font-medium">{d[2]}</TableCell>
              <TableCell className="font-medium">{courseID}</TableCell>
              <TableCell className="font-medium">Student</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
