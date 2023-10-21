'use client';

import UsersContextProvider from '../context-users';
import { columns } from './columns';
import UserTable from './UserTable';
import Loading from '@/components/general/loading';
import { useUsersContext } from '../context-users';
import { useEffect } from 'react';
const ManageSiteUsers = () => {
  const { userData, setUserData } = useUsersContext();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="block h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex flex-wrap items-center justify-between space-y-7 md:space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>

          <div className="flex items-center space-x-2"></div>
        </div>

        <UsersContextProvider>
          <UserTable columns={columns} />
        </UsersContextProvider>
      </div>
    </div>
  );
};

export default ManageSiteUsers;
