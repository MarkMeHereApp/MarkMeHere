'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from 'components/ui/button';
import { useState } from 'react';

export const GetCanvasCourses = () => {
  const [canvasCourses, setCanvasCourses] = useState([]);

  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery();
  const handleClick = async () => {
    await getCanvasCoursesQuery.refetch();
    console.log(canvasCourses);
  };

  return (
    <>
      <Button variant="default" onClick={handleClick}>
        Get Canvas Courses
      </Button>
      <h4>{JSON.stringify(canvasCourses)}</h4>
    </>
  );
};
