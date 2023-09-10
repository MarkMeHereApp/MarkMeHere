'use client';

import CRUDButtons from '@/components/devUtils/CRUDButtons';
import DataTable from './DataTable';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/course-context';
import EnrollCourseMemberButton from '@/components/devUtils/EnrollCourseMemberButton';
import Import_CSV from './CSV_Import';

const ManageCourseMembers = () => {
  const { selectedCourseId } = useCourseContext();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Manage Course Members
          </h2>
          {selectedCourseId && (
            <div className="flex items-center space-x-2">
              <EnrollCourseMemberButton />
              <Import_CSV />

              <Button>Export CSV</Button>
            </div>
          )}
        </div>
        {selectedCourseId ? (
          <>
            <CRUDButtons />
            <DataTable columns={columns} />
          </>
        ) : (
          <div className="pt-8 flex justify-center items-center">
            <h3>Create/Choose a course!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCourseMembers;
