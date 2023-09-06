'use client';

import { useCourseContext } from '@/app/course-context';
import { Button } from 'components/ui/button';

const ShowCurrentCourseMembers = () => {
  const { userCourseMembers } = useCourseContext();
  return (
    <Button
      variant="default"
      onClick={() => {
        console.log(userCourseMembers);
      }}
    >
      Show Current Course Members
    </Button>
  );
};

export default ShowCurrentCourseMembers;
