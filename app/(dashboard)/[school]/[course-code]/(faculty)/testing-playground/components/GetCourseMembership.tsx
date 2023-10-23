import React, { useEffect, useState } from 'react';
import { useCourseContext } from '@/app/(dashboard)/[school]/[course-code]/context-course';

const GetCourseMembership = () => {
  const { courseMembersOfSelectedCourse } = useCourseContext();

  return (
    <div>
      {courseMembersOfSelectedCourse &&
        JSON.stringify(courseMembersOfSelectedCourse)}
    </div>
  );
};

export default GetCourseMembership;
