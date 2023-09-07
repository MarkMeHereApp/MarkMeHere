'use client';

import { Button } from '@/components/ui/button';
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons';
import { DataTableViewOptions } from './DataTableViewOptions';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { DataTableFacetedFilter } from './DataTableFacetedFilter';
import { roles } from './dataUtils';
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
          <Button
            variant="destructive"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete Selected Course Member(s)
          </Button>
        )}
      </div>
      <div className="flex flex-row space-x-2"></div>
    </div>
  );
}
