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

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/context-course';
import { useLecturesContext } from '@/app/context-lecture';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { ExtendedCourseMember } from '@/types/sharedZodTypes';
import { Icons } from '@/components/ui/icons';
import Loading from '@/components/general/loading';

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

  const [lectureLoading, setLectureLoading] = React.useState<boolean>(false);
  const { setLectures, lectures } = useLecturesContext();
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
    throw error;
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
    autoResetAll: false,
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

  const getCurrentLecture = () => {
    if (lectures) {
      return lectures.find((lecture) => {
        return (
          lecture.lectureDate.getTime() === selectedAttendanceDate.getTime()
        );
      });
    }
  };

  useEffect(() => {
    if (lectures) {
      // We need this to refetch the attendance entries when the date is changed
      const currentLecture = getCurrentLecture();
      if (!currentLecture) return;

      const newExtendedCourseMembers: ExtendedCourseMember[] = (
        courseMembersOfSelectedCourse || []
      )
        ?.map((member) => {
          // Find the corresponding attendance entry for the member
          const attendanceEntry = currentLecture?.attendanceEntries.find(
            (entry) => entry.courseMemberId === member.id
          );
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
  }, [lectures, selectedAttendanceDate]);

  const CreateNewLectureButton = () => {
    const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();

    const handleClick = async () => {
      if (selectedCourseId && selectedAttendanceDate) {
        setLectureLoading(true);
        try {
          // You shouldn't be able to create a new lecture if we are loading lecture data.
          if (!lectures) throw new Error('Unexpected server error.');
          const newLecture = await createNewLectureMutation.mutateAsync({
            courseId: selectedCourseId,
            lectureDate: selectedAttendanceDate
          });
          if (!newLecture || !newLecture.newLecture)
            throw new Error('Unexpected server error.');

          const newLectures = [
            ...lectures,
            { attendanceEntries: [], ...newLecture.newLecture }
          ];
          setLectures(newLectures);

          toast({
            title: 'Created New Lecture!',
            description: `Successfully created a new lecture for ${
              selectedAttendanceDate.toISOString().split('T')[0]
            }`,
            icon: 'success'
          });
          setLectureLoading(false);
        } catch (error) {
          setLectureLoading(false);
          setError(error as Error);
        }
      }
    };
    return (
      <Button disabled={lectureLoading} onClick={() => handleClick()}>
        {lectureLoading ? (
          <Loading name="Creating" />
        ) : (
          <span>Create a new lecture</span>
        )}
      </Button>
    );
  };

  return selectedCourseId ? (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      {lectures === null ? (
        <div className="pt-8 flex justify-center items-center">
          <Icons.logo
            className="wave primary-foreground"
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      ) : getCurrentLecture() ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const shouldHideColumn = [
                        'email',
                        'lmsId',
                        'date marked',
                        'status'
                      ];
                      return (
                        <TableHead
                          key={header.id}
                          className={
                            shouldHideColumn.includes(header.id)
                              ? 'hidden md:table-cell lg:table-cell'
                              : 'table-cell md:table-cell lg:table-cell'
                          }
                        >
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
                      {row.getVisibleCells().map((cell) => {
                        const shouldHideColumn = [
                          'email',
                          'lmsId',
                          'date marked',
                          'status'
                        ];
                        return (
                          <TableCell
                            key={cell.id}
                            className={
                              shouldHideColumn.includes(cell.column.id)
                                ? 'hidden md:table-cell lg:table-cell'
                                : 'table-cell md:table-cell lg:table-cell'
                            }
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
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
