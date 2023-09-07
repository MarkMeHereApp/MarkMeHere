'use client';

import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';
import Loading from '../general/loading';

const DeleteAllStudents = () => {
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
  ) : (
    <Loading />
  );
};

export default DeleteAllStudents;