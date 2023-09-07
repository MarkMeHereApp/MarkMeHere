'use client';

import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';
import { CourseMember } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { trpc } from '@/app/_trpc/client';
import Loading from '../general/loading';
import { zCourseMember } from '@/server/routes/courseMember';

const createRandomCourseMember = (selectedCourseId: string) =>
  ({
    id: faker.string.uuid(),
    lmsId: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    courseId: selectedCourseId,
    dateEnrolled: new Date(),
    role: 'student'
  }) as CourseMember;

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
  ) : (
    <Loading />
  );
};

export default GenerateRandomCourseMember;
