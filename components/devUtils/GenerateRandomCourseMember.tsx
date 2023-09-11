'use client';

import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';
import { CourseMember } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { trpc } from '@/app/_trpc/client';
import Loading from '../general/loading';
import { zCourseMember } from '@/server/routes/courseMember';

const createRandomCourseMember = (selectedCourseId: string): CourseMember => ({
  id: uuidv4(),
  lmsId: uuidv4(),
  email: `${uuidv4()}@example.com`, // Generate a unique email
  name: `User ${Math.floor(Math.random() * 1000)}`, // Generate a random name
  courseId: selectedCourseId,
  dateEnrolled: new Date(),
  role: 'student'
});

const GenerateRandomCourseMember = () => {
  const { selectedCourseId, setCourseMembersOfSelectedCourse } =
    useCourseContext();
  const createCourseMemberMutation =
    trpc.courseMember.createCourseMember.useMutation();
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
      const newMemberData = createRandomCourseMember(selectedCourseId);
      await createCourseMemberMutation.mutateAsync({
        ...newMemberData
      });
      await getCourseMembersOfCourseQuery.refetch();
    } else {
      throw new Error('No selected course');
    }
  };

  return selectedCourseId ? (
    <Button variant="default" onClick={handleClick}>
      Generate Random Course Member
    </Button>
  ) : null;
};

export default GenerateRandomCourseMember;
