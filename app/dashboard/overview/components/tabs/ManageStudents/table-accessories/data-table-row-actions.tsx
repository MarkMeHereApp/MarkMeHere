import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

import { Dialog } from '@/components/ui/dialog';
import { Row } from '@tanstack/react-table';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  return (
    <Dialog>
      <Pencil1Icon className="h-4 w-4" />
      <h2>{row.id}</h2>
      <TrashIcon className="h-4 w-4"></TrashIcon>
    </Dialog>
  );
}
