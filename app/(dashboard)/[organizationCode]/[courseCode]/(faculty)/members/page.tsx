import DataTable from './DataTable';
import { columns } from './columns';
import EnrollCourseMemberButton from '@/utils/devUtilsComponents/EnrollCourseMemberButton';
import { CSV_Dialog } from './CSV_Dialog';
import DeleteCourseButton from '@/utils/devUtilsComponents/DeleteCourseButton';
import { Suspense } from 'react';
import prisma from '@/prisma';
import { SyncCanvasMembersButton } from '@/utils/devUtilsComponents/SyncCanvasGrade';

export default async function MemberPage({
  params
}: {
  params: { organizationCode: string; courseCode: string };
}) {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8  md:flex py-8 px-2 sm:px-8">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Members</h2>

          <div className="flex items-center space-x-2">
            <SyncCanvasMembersButton />
            <EnrollCourseMemberButton />
            <CSV_Dialog />
            <DeleteCourseButton />
          </div>
        </div>

        <DataTable columns={columns} />
      </div>
    </div>
  );
}
