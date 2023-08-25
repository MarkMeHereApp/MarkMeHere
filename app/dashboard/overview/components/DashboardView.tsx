'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import StudentAnalytics from './tabs/StudentAnalytics';
import { User } from '@/utils/sharedTypes';

const getUsers = async () => {
  try {
    const response = await fetch('/api/prisma', {
      method: 'GET'
    });

    if (response.ok) {
      const responseData: { users: User[] } = await response.json(); // Use the correct type here
      const users = responseData.users;
      return users;
    } else {
      console.error('Failed to fetch data:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DashboardView = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const users = await getUsers();

      if (users?.length > 0) {
        setUsers(users);
      } else {
        console.error('No user data received.');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setUsers([]);
    }
  };

  const handleAddRandomStudentClick = async () => {
    try {
      const response = await fetch('/api/prisma', {
        method: 'POST'
      });

      if (response.ok) {
        const responseData: { users: User[] } = await response.json(); // Use the correct type here
        const users = responseData.users;
        setUsers(users);
      } else {
        console.error('Failed to fetch data:', response.status);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setUsers([]);
    }
  };

  return (
    <Tabs defaultValue="student-analytics">
      <TabsList>
        <TabsTrigger value="overview" disabled>
          Overview
        </TabsTrigger>
        <TabsTrigger value="manage-students">Manage Students</TabsTrigger>
        <TabsTrigger value="student-analytics">Student Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="manage-students">
        <h2>hi</h2>
      </TabsContent>
      <TabsContent value="student-analytics">
        <StudentAnalytics users={users} />
        <Button
          variant={'ghost'}
          onClick={() => handleAddRandomStudentClick()}
          className={
            'text-sm font-medium text-foreground transition-colors hover:text-background w-1/2 border-2'
          }
        >
          + Add Random Student to DB +
        </Button>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardView;
