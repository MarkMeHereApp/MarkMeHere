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

import { DataTablePagination } from '../components/data-table-pagination';
import { DataTableToolbar } from '../components/data-table-toolbar';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { AttendanceEntry, CourseMember, Lecture } from '@prisma/client';

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
  const [lecture, setLecture] = React.useState(false);
  const [attendanceEntries, setAttendanceEntries] = React.useState<
    AttendanceEntry[]
  >([]);
  const [currentLectureId, setCurrentLectureId] = React.useState<string>('');
  const [courseMembers, setCourseMembers] = React.useState<CourseMember[]>([]);

  useEffect(() => {
    if (courseMembersOfSelectedCourse) {
      const newCourseMembers: CourseMember[] =
        courseMembersOfSelectedCourse?.filter(
          (member) =>
            member.courseId === selectedCourseId && member.role === 'student'
        );
      setCourseMembers(newCourseMembers);
    }
  }, [courseMembersOfSelectedCourse]);

  const data = courseMembers as TData[];
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
  }); //

  // handle checking if the lecture exists for a specific date
  const getLecturesOfCourseQuery = trpc.lecture.getLecturesofCourse.useQuery(
    {
      courseId: selectedCourseId || ''
    },
    {
      onSuccess: (data) => {
        if (!data) return;
        const lectures = data.lectures;
        const lectureStatus = lectures.some((lecture: Lecture) => {
          // Check if lectureDate matches selectedAttendanceDate
          const dateMatch =
            lecture.lectureDate.getTime() === selectedAttendanceDate?.getTime();

          if (dateMatch) {
            setCurrentLectureId(lecture.id);
            getAttendanceEntriesOfLectureQuery.refetch();
          }

          return dateMatch;
        });
        setLecture(lectureStatus);
      }
    }
  );

  // handle getting the attendance entries for the lecture
  const getAttendanceEntriesOfLectureQuery =
    trpc.attendance.getAttendanceDataOfCourse.useQuery(
      {
        lectureId: currentLectureId || ''
      },
      {
        onSuccess: (data) => {
          if (!data) return;
          setAttendanceEntries(data.attendanceEntries);
        }
      }
    );

  useEffect(() => {
    getLecturesOfCourseQuery.refetch();
  }, [selectedAttendanceDate]);

  const CreateNewLectureButton = () => {
    const { selectedCourseId, selectedAttendanceDate } = useCourseContext();
    const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();

    const handleClick = async () => {
      if (selectedCourseId && selectedAttendanceDate) {
        await createNewLectureMutation.mutateAsync({
          courseId: selectedCourseId || '',
          lectureDate: selectedAttendanceDate || new Date()
        });
        await getLecturesOfCourseQuery.refetch();
        toast({
          title: `Successfully created a new lecture for ${selectedAttendanceDate}`
        });
      }
    };
    return <Button onClick={() => handleClick()}>Create a new lecture</Button>;
  };

  return courseMembersOfSelectedCourse ? (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      {lecture ? (
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
        <div className="pt-24 flex justify-center items-center">
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
  ) : null;
}
