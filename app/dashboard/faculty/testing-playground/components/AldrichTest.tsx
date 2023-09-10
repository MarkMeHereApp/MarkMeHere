'use client';
import { useCourseContext } from '@/app/course-context';
import CRUDButtons from '@/components/devUtils/CRUDButtons';

const AldrichTestPage = () => {
  const data = useCourseContext();

  return (
    <div>
      <CRUDButtons />
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
    </div>
  );
};

export default AldrichTestPage;
