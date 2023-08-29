'use client';

import { lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ManageStudents = lazy(() => import('./tabs/ManageStudents/page'));
const StudentAnalytics = lazy(() => import('./tabs/StudentAnalytics/page'));

const DashboardView = () => {
  return (
    <Tabs defaultValue="manage-students">
      <TabsList>
        <TabsTrigger value="overview" disabled>
          Overview
        </TabsTrigger>
        <TabsTrigger value="manage-students">Manage Students</TabsTrigger>
        <TabsTrigger value="student-analytics">Student Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="manage-students">
        <ManageStudents />
      </TabsContent>
      <TabsContent value="student-analytics">
        <StudentAnalytics />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardView;
