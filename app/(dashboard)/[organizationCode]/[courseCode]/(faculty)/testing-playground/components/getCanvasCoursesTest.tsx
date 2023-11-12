'use client';

import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';

const GetCanvasCourses = () => {
  const { organization } = useOrganizationContext();
  const getCanvasCoursesQuery = trpc.canvas.getCanvasCourses.useQuery({
    organizationCode: organization.uniqueCode
  });

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
