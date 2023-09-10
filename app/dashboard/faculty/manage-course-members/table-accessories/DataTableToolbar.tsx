'use client';

import { Button } from '@/components/ui/button';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DataTableViewOptions } from './DataTableViewOptions';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { roles } from './dataUtils';
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/course-context';
import { CourseMember } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected =
    table.getIsAllRowsSelected() || table.getIsSomeRowsSelected();
  const globalFilter = table.getState().globalFilter;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedCourseId, setCourseMembersOfSelectedCourse } =
    useCourseContext();
  const deleteCourseMemberMutation =
    trpc.courseMember.deleteCourseMembers.useMutation();
  const getCourseMembersOfCourseQuery =
    trpc.courseMember.getCourseMembersOfCourse.useQuery(
      {
        courseId: selectedCourseId || ''
      },
      {
        onSuccess: (data) => {
          if (!data) return;
          setCourseMembersOfSelectedCourse(data.courseMembers);
        }
      }
    );

  const session = useSession();
  const userEmail = session.data?.user?.email;

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleConfirmDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    const filteredCourseMembers = selectedCourseMembers.filter((member) => {
      return member.email !== userEmail;
    });
    await deleteCourseMemberMutation.mutateAsync(filteredCourseMembers);
    table.resetRowSelection();
    handleDialogClose();
    await getCourseMembersOfCourseQuery.refetch();

    const deletedNames = filteredCourseMembers
      .map((member) => member.name)
      .join(', ');

    toast({
      title: `Successfully deleted ${filteredCourseMembers.length} course member(s)!`,
      description: `Deleted: ${deletedNames}`,
      icon: 'success'
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search for a course member..."
          value={'globalFilter' in table.getState() ? globalFilter : ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const searchString = event.target.value;
            table.setGlobalFilter(searchString);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableViewOptions table={table} />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Roles"
            options={roles}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isSelected && (
          <>
            <Dialog open={isDialogOpen}>
              <DialogTrigger onClick={() => handleDialogOpen()} asChild>
                <Button variant="destructive" className="h-8 px-2 lg:px-3">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Selected Course Member(s)
                </Button>
              </DialogTrigger>
              <DialogContent onClose={() => handleDialogClose()}>
                <DialogHeader>
                  <DialogHeader>
                    <DialogTitle>Confirm Data Deletion</DialogTitle>
                    <DialogDescription>
                      This action is irreversible. Are you certain you wish to
                      permanently delete all the selected course members data?
                    </DialogDescription>
                  </DialogHeader>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleConfirmDelete();
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDialogClose();
                    }}
                  >
                    No
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
      <div className="flex flex-row space-x-2"></div>
    </div>
  );
}
