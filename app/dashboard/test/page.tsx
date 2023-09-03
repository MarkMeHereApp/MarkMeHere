'use client';
import { useCourseContext } from '@/app/course-context';
import CRUDButtons from '@/components/devUtils/CRUDButtons';

const TestPage = () => {
  const data = useCourseContext();
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();

  const handleButtonClick = async () => {
    if (data.selectedCourseId === null) return;
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
  };

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
      <CRUDButtons />
    </div>
  );
};

export default TestPage;
