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
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { useLecturesContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
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
  const { courseMembersOfSelectedCourse, selectedCourseId } =
    useCourseContext();

  const [lectureLoading, setLectureLoading] = React.useState<boolean>(false);
  const { setLectures, lectures, selectedAttendanceDate } =
    useLecturesContext();
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
      shouldShowLocation();
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
            {
              attendanceEntries: [],
              professorLectureGeolocation: [],
              ...newLecture.newLecture
            }
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

  const shouldShowLocation = () => {
    const curLecture = getCurrentLecture();
    if (curLecture) {
      const showGeolocationColumn = curLecture.attendanceEntries.some(
        (entry) => entry.ProfessorLectureGeolocationId !== null
      );
      table.setColumnVisibility({
        ...columnVisibility,
        location: showGeolocationColumn
      });
    }
  };

  return (
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
                      const shouldHideColumnMd = [
                        'email',
                        'lmsId',
                        'date marked'
                      ];
                      const shouldHideColumnSm = ['status', 'location'];

                      let cName = 'table-cell lg:table-cell';

                      if (shouldHideColumnMd.includes(header.id)) {
                        cName = ' hidden lg:table-cell';
                      }

                      if (shouldHideColumnSm.includes(header.id)) {
                        cName = ' hidden md:table-cell';
                      }

                      return (
                        <TableHead key={header.id} className={cName}>
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
                      className="h-24 sm:h-12"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const shouldHideColumnMd = [
                          'email',
                          'lmsId',
                          'date marked'
                        ];
                        const shouldHideColumnSm = ['status', 'location'];

                        let cName = 'table-cell lg:table-cell';

                        if (shouldHideColumnMd.includes(cell.column.id)) {
                          cName = ' hidden lg:table-cell';
                        }

                        if (shouldHideColumnSm.includes(cell.column.id)) {
                          cName = ' hidden md:table-cell';
                        }
                        return (
                          <TableCell key={cell.id} className={cName}>
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
              <CardTitle>No attendance data available.</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <CreateNewLectureButton />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
