'use client';

import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';
import { CourseMember } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { trpc } from '@/app/_trpc/client';

const createRandomCourseMember = (selectedCourseId: string) =>
  ({
    id: faker.string.uuid(),
    lmsId: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    courseId: selectedCourseId,
    dateEnrolled: new Date(),
    role: 'STUDENT'
  }) as CourseMember;

export const GenerateRandomCourseMember = () => {
  const {
    selectedCourseId,
    courseMembersOfSelectedCourse,
    setCourseMembersOfSelectedCourse
  } = useCourseContext();
  const createCourseMemberMutation =
    trpc.courseMember.createCourseMember.useMutation();

  const handleClick = async () => {
    if (selectedCourseId) {
      const newMemberData = createRandomCourseMember(selectedCourseId);
      const res = await createCourseMemberMutation.mutateAsync({
        newMemberData
      });
      const resCourseMember = res.resEnrollment;

      if (courseMembersOfSelectedCourse && resCourseMember) {
        const updatedUserCourseMembers = [
          ...courseMembersOfSelectedCourse.filter(Boolean),
          resCourseMember
        ];
        setCourseMembersOfSelectedCourse(updatedUserCourseMembers);
      }
    } else {
      throw new Error('No selected course');
    }
  };

  return (
    selectedCourseId && (
      <Button variant="default" onClick={handleClick}>
        Generate Random Course Member
      </Button>
    )
  );
};
