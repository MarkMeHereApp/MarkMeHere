'use client';

import { useCourseContext } from '@/app/context-course';
import { Button } from 'components/ui/button';
import { CourseMember } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { trpc } from '@/app/_trpc/client';
import { zCourseRolesType } from '@/types/sharedZodTypes';

type randomCourseMember = {
  email: string;
  name: string;
  courseId: string;
  role: zCourseRolesType;
};

const createRandomCourseMember = (selectedCourseId: string): randomCourseMember => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  courseId: selectedCourseId,
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
