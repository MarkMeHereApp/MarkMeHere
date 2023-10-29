'use client';

import * as React from 'react';
import { useState, createContext, useEffect } from 'react';

import { User } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';

interface UserData {
  users: User[] | null;
  isLoaded: boolean;
}

interface UsersContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}
const UsersContext = createContext<UsersContextType>({
  userData: { users: [], isLoaded: false },
  setUserData: () => {}
});

export default function UsersContextProvider({
  children
}: {
  children?: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData>({
    users: null,
    isLoaded: false
  });

  const usersData = trpc.user.getAllUsers.useQuery(undefined, {
    onSuccess: (data) => {
      setUserData({ ...userData, users: data.users });
    }
  });

  return (
    <UsersContext.Provider
      value={{
        userData,
        setUserData
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export const useUsersContext = () => React.useContext(UsersContext);
