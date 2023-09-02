'use client';

import CRUDButtons from '@/components/devUtils/CRUDButtons';
import DataTable from './DataTable';
import { columns } from './columns';

const ManageCourseMembers = () => {
  return (
    <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <CRUDButtons />
      <DataTable columns={columns} />
    </div>
  );
};

export default ManageCourseMembers;
