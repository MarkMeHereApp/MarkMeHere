'use client';

import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/context-course';
import { Button } from 'components/ui/button';

const DeleteAllStudentsButton = () => {
  const { selectedCourseId, setCourseMembersOfSelectedCourse } =
    useCourseContext();
  const deleteAllStudentsMutation =
    trpc.courseMember.deleteAllStudents.useMutation();
  const getCourseMembersOfCourseQuery =
    trpc.courseMember.getCourseMembersOfCourse.useQuery(
      {
        courseId: selectedCourseId || ''
      },
      {
        onSuccess: (data) => {
          if (!data) return;
          setCourseMembersOfSelectedCourse(data.courseMembers);
        }
      }
    );

  const handleClick = async () => {
    if (selectedCourseId) {
      await deleteAllStudentsMutation.mutateAsync();
      await getCourseMembersOfCourseQuery.refetch();
    } else {
      throw new Error('No selected course');
    }
  };

  return selectedCourseId ? (
    <Button variant="default" onClick={handleClick}>
      Delete All Students
    </Button>
  ) : null;
};

export default DeleteAllStudentsButton;
