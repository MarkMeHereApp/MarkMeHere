'use client';

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

import { DataTablePagination } from './table-accessories/DataTablePagination';
import { DataTableToolbar } from './table-accessories/DataTableToolbar';
import { useState } from 'react';
import { useCourseContext } from '@/app/context-course';
import Loading from '@/components/general/loading';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

export default function DataTable<TData, TValue>({
  columns
}: DataTableProps<TData, TValue>) {
  const { courseMembersOfSelectedCourse } = useCourseContext();
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = courseMembersOfSelectedCourse as TData[];
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

  return courseMembersOfSelectedCourse ? (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const shouldHideColumn = ['email', 'lmsId'];
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
                    const shouldHideColumn = ['email', 'lmsId'];
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
    <Loading />
  );
}
