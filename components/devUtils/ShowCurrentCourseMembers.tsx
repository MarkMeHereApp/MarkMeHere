'use client';

import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';

const ShowCurrentCourseMembers = () => {
  const { selectedCourseId, courseMembersOfSelectedCourse } =
    useCourseContext();
  return (
    selectedCourseId && (
      <Button
        variant="default"
        onClick={() => {
          console.log(courseMembersOfSelectedCourse);
        }}
      >
        Console Log Current Course Members
      </Button>
    )
  );
};

export default ShowCurrentCourseMembers;
