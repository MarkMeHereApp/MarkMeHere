'use client';

import { useCourseContext } from '@/app/context-course';
import { Button } from 'components/ui/button';

export const ShowCurrentCourseMembers = () => {
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
