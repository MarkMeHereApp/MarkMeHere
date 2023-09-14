'use client';

import { useCourseContext } from '@/app/context-course';
import { Button } from 'components/ui/button';

const ShowCurrentCourseMembers = () => {
  const { selectedCourseId, courseMembersOfSelectedCourse } =
    useCourseContext();
  return selectedCourseId ? (
    <Button
      variant="default"
      onClick={() => {
        console.log(courseMembersOfSelectedCourse);
      }}
    >
      Console Log Current Course Members
    </Button>
  ) : null;
};

export default ShowCurrentCourseMembers;
