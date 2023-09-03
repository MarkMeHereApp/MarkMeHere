'use client';
import { useCourseContext } from '@/app/course-context';
import CRUDButtons from '@/components/devUtils/CRUDButtons';

const TestPage = () => {
  const data = useCourseContext();

  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <p key={key}>{`${key}: ${JSON.stringify(value)}`}</p>
      ))}
      <CRUDButtons />
    </div>
  );
};

export default TestPage;
