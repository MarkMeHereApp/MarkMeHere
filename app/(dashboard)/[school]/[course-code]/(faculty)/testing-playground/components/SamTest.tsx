'use client';
import { useCourseContext } from '@/app/context-course';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';

const SamsTestPage = () => {
  const data = useCourseContext();
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    if (data.selectedCourseId === null) return;
    setIsLoading(true);
    try {
      const newMembers = await createManyCourseMembers.mutateAsync({
        courseId: data.selectedCourseId,
        courseMembers: [
          {
            name: 'Test',
            email: 'test@example.com',
            role: 'student'
          },
          {
            name: 'Test2',
            email: 'test2@example.com',
            role: 'student'
          }
        ]
      });
      data.setCourseMembersOfSelectedCourse(newMembers.allCourseMembersOfClass);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error('Error Making Class Members');
    }
  };

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
      <Button onClick={handleButtonClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Add CourseMembers To List'}
      </Button>
    </div>
  );
};

export default SamsTestPage;
