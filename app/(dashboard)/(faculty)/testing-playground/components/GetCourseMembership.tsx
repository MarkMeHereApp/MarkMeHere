import React, { useEffect, useState } from 'react';
import { useCourseContext } from '@/app/context-course';

const GetCourseMembership = () => {
  const { userCourseMembers } = useCourseContext();
  const [courseMemberships, setCourseMemberships] = useState(null);

  return (
    <div>
      {userCourseMembers &&
        userCourseMembers.map((membership, index) => (
          <div key={index}>
            <p>Course ID: {membership.courseId}</p>
            <p>Name: {membership.name}</p>
            <p>Role: {membership.role}</p>
          </div>
        ))}
    </div>
  );
};

export default GetCourseMembership;
