'use client';

import CRUDButtons from '@/utils/devUtilsComponents/CRUDButtons';
import DataTable from './DataTable';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/context-course';
import EnrollCourseMemberButton from '@/utils/devUtilsComponents/EnrollCourseMemberButton';
import Import_CSV from './CSV_Import';
import { Icons } from '@/components/ui/icons';
import CreateChooseCourseAnimation from '@/components/mark-me-here/CreateChooseCourseAnimation';

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
          <CreateChooseCourseAnimation />
        )}
      </div>
    </div>
  );
};

export default ManageCourseMembers;
