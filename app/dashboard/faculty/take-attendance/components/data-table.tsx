'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toastError } from '@/utils/globalFunctions';

import { DataTablePagination } from '../components/data-table-pagination';
import { DataTableToolbar } from '../components/data-table-toolbar';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { AttendanceEntry, CourseMember } from '@prisma/client';
import {
  zAttendanceStatus,
  ExtendedCourseMember,
  zAttendanceStatusType
} from '@/types/sharedZodTypes';
import { throwErrorOrShowToast } from '@/utils/globalFunctions';
import { Icons } from '@/components/ui/icons';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({
  columns
}: DataTableProps<TData, TValue>) {
  const {
    selectedAttendanceDate,
    courseMembersOfSelectedCourse,
    selectedCourseId
  } = useCourseContext();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [extendedCourseMembers, setExtendedCourseMembers] = React.useState<
    ExtendedCourseMember[]
  >([]);
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    setExtendedCourseMembers([]);
    throwErrorOrShowToast(error as Error);
    setError(null);
  }

  const data = extendedCourseMembers as TData[];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  // handle checking if the lecture exists for a specific date
  const getLectureOfCourseQuery = trpc.lecture.tryGetLectureFromDate.useQuery(
    {
      courseId: selectedCourseId || '',
      lectureDate: selectedAttendanceDate
    },
    {
      enabled: !!selectedAttendanceDate && !!selectedCourseId
    }
  );

  if (getLectureOfCourseQuery.error) {
    throw getLectureOfCourseQuery.error;
  }

  useEffect(() => {
    getLectureOfCourseQuery.refetch();
  }, [selectedAttendanceDate]);

  useEffect(() => {
    if (courseMembersOfSelectedCourse && getLectureOfCourseQuery.data) {
      // We need this to refetch the attendance entries when the date is changed
      const newExtendedCourseMembers: ExtendedCourseMember[] =
        courseMembersOfSelectedCourse
          ?.map((member) => {
            // Find the corresponding attendance entry for the member
            let attendanceEntry: AttendanceEntry | undefined;
            if (getLectureOfCourseQuery.data.attendance) {
              attendanceEntry = getLectureOfCourseQuery.data.attendance.find(
                (entry: AttendanceEntry) => entry.courseMemberId === member.id
              );
            }
            return {
              ...member,
              AttendanceEntry: attendanceEntry
            };
          })
          .filter(
            (member) =>
              member.courseId === selectedCourseId && member.role === 'student'
          );
      setExtendedCourseMembers(newExtendedCourseMembers);
    }
  }, [getLectureOfCourseQuery.isSuccess]);

  const CreateNewLectureButton = () => {
    const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();

    const handleClick = async () => {
      if (selectedCourseId && selectedAttendanceDate) {
        try {
          await createNewLectureMutation.mutateAsync({
            courseId: selectedCourseId,
            lectureDate: selectedAttendanceDate
          });
          getLectureOfCourseQuery.refetch();
          toast({
            title: 'Created New Lecture!',
            description: `Successfully created a new lecture for ${selectedAttendanceDate}`,
            icon: 'success'
          });
        } catch (error) {
          setError(error as Error);
        }
      }
    };
    return <Button onClick={() => handleClick()}>Create a new lecture</Button>;
  };

  return selectedCourseId ? (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      {getLectureOfCourseQuery.isLoading ||
      getLectureOfCourseQuery.isFetching ? (
        <div className="pt-8 flex justify-center items-center">
          <Icons.logo
            className="wave primary-foreground"
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      ) : getLectureOfCourseQuery.data.lecture ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      ) : (
        <div className="pt-8 flex justify-center items-center">
          <Card className="w-85 h-50">
            <CardHeader>
              <CardTitle>
                There is no attendance data available for this date.
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <CreateNewLectureButton />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  ) : (
    <div className="pt-8 flex justify-center items-center">
      <h3>Create/Choose a course!</h3>
    </div>
  );
}
