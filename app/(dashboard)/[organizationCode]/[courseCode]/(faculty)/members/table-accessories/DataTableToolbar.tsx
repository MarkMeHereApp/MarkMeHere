'use client';

import { Button } from '@/components/ui/button';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DataTableViewOptions } from './DataTableViewOptions';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { roles } from './dataUtils';
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { CourseMember } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { Icons } from '@/components/ui/icons';
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
  const [error, setError] = useState<Error | null>(null);
  const { setCourseMembersOfSelectedCourse, selectedCourse } =
    useCourseContext();

  if (error) {
    throw error;
  }

  const deleteCourseMemberMutation =
    trpc.courseMember.deleteCourseMembers.useMutation();

  const session = useSession();
  const userEmail = session.data?.user?.email;

  const handleConfirmDelete = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedCourseMembers: CourseMember[] = selectedRows.map(
        (row) => row.original
      ) as CourseMember[];
      const filteredCourseMembers = selectedCourseMembers.filter((member) => {
        return member.email !== userEmail;
      });

      if (!selectedCourse) {
        setError(new Error('Selected Course is undefined.'));
        return;
      }

      const CourseMemberIds = filteredCourseMembers.map((member) => member.id);

      await deleteCourseMemberMutation.mutateAsync({
        courseId: selectedCourse.id,
        courseMemberIds: CourseMemberIds
      });
      table.resetRowSelection();

      setCourseMembersOfSelectedCourse((prev) => {
        if (!prev) return [];
        return prev.filter((courseMember) => {
          return !filteredCourseMembers.some((filteredMember) => {
            return filteredMember.id === courseMember.id;
          });
        });
      });

      const deletedNames = filteredCourseMembers
        .map((member) => member.name)
        .join(', ');

      toast({
        title:
          filteredCourseMembers.length > 1
            ? `Successfully deleted ${filteredCourseMembers.length} course members!`
            : `Successfully deleted a course member!`,
        description: `Deleted: ${deletedNames}`,
        icon: 'success'
      });
    } catch (error) {
      setError(error as Error);
    }
  };

  const areWeSelectingSelf = () => {
    if (!isSelected) {
      return false;
    }
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    return selectedCourseMembers.some((member) => member.email === userEmail);
  };

  // Since we can't delete ourselves, we need to check if we are only selecting ourselves
  const areOtherUsersSelected = () => {
    if (!isSelected) {
      return false;
    }

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCourseMembers: CourseMember[] = selectedRows.map(
      (row) => row.original
    ) as CourseMember[];
    const filteredCourseMembers = selectedCourseMembers.filter((member) => {
      return member.email !== userEmail;
    });
    return filteredCourseMembers.length > 0;
  };

  const WarningMessage = () => (
    <div>
      <p>
        <b className="text-destructive">
          Deleting users is permanent and cannot be undone.
        </b>
        {areWeSelectingSelf() && (
          <>
            <br />
            <br />
            <b className="text-primary">
              Although you've selected yourself, you will not be deleted from
              the course.
            </b>
          </>
        )}
      </p>
    </div>
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search"
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
            <AreYouSureDialog
              title="Confirm Data Deletion"
              proceedText="DELETE"
              buttonText="Delete"
              AlertDescriptionComponent={WarningMessage}
              bDestructive={true}
              onConfirm={handleConfirmDelete}
            >
              <Button
                variant="destructive"
                disabled={!areOtherUsersSelected()}
                className="h-8 px-2 lg:px-3"
              >
                <TrashIcon className=" h-4 w-4" />
                <span className=" ml-2 hidden sm:inline">Delete Member(s)</span>
              </Button>
            </AreYouSureDialog>
          </>
        )}
      </div>
      <div className="flex flex-row space-x-2"></div>
    </div>
  );
}
