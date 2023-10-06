'use client';

import { trpc } from '@/app/_trpc/client';
import ManageCoursesDisplay from './ManageCoursesDisplay';
import { useState } from 'react';
import { Course } from '@prisma/client';

const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  trpc.course.getAllCourses.useQuery(undefined, {
    onSuccess: (data) => {
      if (!data) return;
      setCourses(data.courses);
    }
  });

  return <ManageCoursesDisplay courses={courses} />;
};

export default ManageCourses;
