'use client';

import { Button } from '@/components/ui/button';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DataTableViewOptions } from './DataTableViewOptions';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { roles } from './dataUtils';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { useUsersContext } from '../../context-users';
import EnrollUser from '@/utils/devUtilsComponents/EnrollUser';
import { User } from '@prisma/client';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { toastSuccess } from '@/utils/globalFunctions';
import { useState } from 'react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const { userData, setUserData } = useUsersContext();
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }

  const isFiltered = table.getState().columnFilters.length > 0;
  const isSelected =
    table.getIsAllRowsSelected() || table.getIsSomeRowsSelected();
  const globalFilter = table.getState().globalFilter;
  const deleteUsers = trpc.user.deleteUser.useMutation();

  const session = useSession();
  const userEmail = session.data?.user?.email;

  const handleConfirmDelete = async () => {
    try {
      const selectedRows = table.getSelectedRowModel().rows;
      const selectedUsers: User[] = selectedRows.map(
        (row) => row.original
      ) as User[];
      const filteredUsers = selectedUsers.filter((member) => {
        return member.email !== userEmail;
      });
      const filteredEmails = filteredUsers.map((user) => user.email);
      const deletedUserEmails = await deleteUsers.mutateAsync({
        email: filteredEmails
      });
      table.resetRowSelection();
      const deletedNames = filteredUsers
        .map((member) => member.name)
        .join(', ');

      // Update the userData based on the deleted user emails
      setUserData((prev) => {
        if (!prev || !prev.users) return prev;

        // Filter out the deleted users
        const updatedUsers = prev.users.filter((user) => {
          return !filteredEmails.includes(user.email);
        });

        return {
          ...prev, // Maintain the rest of the properties
          users: updatedUsers // Only update the users array
        };
      });

      toastSuccess(`Successfully Deleted ${deletedNames}`);
    } catch (error) {
      setError(error as Error);
    }
  };

  const WarningMessage = () => (
    <div>
      <p>
        <b className="text-destructive">
          Deleting users is permanent and cannot be undone.
        </b>
      </p>
    </div>
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search for users..."
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
              bDestructive={true}
              AlertDescriptionComponent={WarningMessage}
              onConfirm={handleConfirmDelete}
            >
              <Button variant="destructive" className="h-8 px-2 lg:px-3">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete Selected User(s)
              </Button>
            </AreYouSureDialog>
          </>
        )}
      </div>
      <EnrollUser />
      <div className="flex flex-row space-x-2"></div>
    </div>
  );
}
