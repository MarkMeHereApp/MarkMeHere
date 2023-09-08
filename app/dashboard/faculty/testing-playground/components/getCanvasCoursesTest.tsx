'use client';

import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';

const GetCanvasCourses = () => {
  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery({});

  // Later in your code
  if (getCanvasCoursesQuery.error) {
    // This should be a throw new error
    toast({
      title: 'ERROR Fetching Canvas Coursesd',
      description: getCanvasCoursesQuery.error.message,
      icon: 'error_for_nondestructive_toasts'
    });
  }

  return (
    <div>
      {getCanvasCoursesQuery.isLoading
        ? 'Loading...'
        : getCanvasCoursesQuery.data && (
            <h4>
              <pre>{JSON.stringify(getCanvasCoursesQuery.data, null, 2)}</pre>
            </h4>
          )}
    </div>
  );
};

export default GetCanvasCourses;
