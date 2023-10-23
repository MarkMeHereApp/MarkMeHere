'use client';
import { useCourseContext } from '@/app/(dashboard)/[school]/[course-code]/context-course';

const AldrichTestPage = () => {
  const data = useCourseContext();

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
    </div>
  );
};

export default AldrichTestPage;
