'use client';

import { columns } from './columns';
import UserTable from './UserTable';

const ManageSiteUsers = () => {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex flex-wrap items-center justify-between space-y-7 md:space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>

          <div className="flex items-center space-x-2"></div>
        </div>

        <UserTable columns={columns} />
      </div>
    </div>
  );
};

export default ManageSiteUsers;
