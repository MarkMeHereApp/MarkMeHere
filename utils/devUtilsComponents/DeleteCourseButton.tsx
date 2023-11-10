import { Button } from '@/components/ui/button';
import { AreYouSureDialog } from '@/components/general/are-you-sure-alert-dialog';
import { toastSuccess } from '@/utils/globalFunctions';
import { trpc } from '@/app/_trpc/client';
import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import { TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zSiteRoles } from '@/types/sharedZodTypes';

const DeleteCourseButton = () => {
  const { selectedCourseId, selectedCourse } = useCourseContext();
  const deleteCourseMutation = trpc.course.deleteCourse.useMutation();
  const router = useRouter();
  const session = useSession();
  const role = session.data?.user.role;

  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error;
  }
  
  const handleConfirmDelete = async () => {
    const course = selectedCourse?.name;
    try {
      await deleteCourseMutation.mutateAsync({
        courseId: selectedCourseId 
      });
      router.refresh();
      router.replace('/');
      toastSuccess(`Successfully Deleted ${course}`);
    } catch (error) {
      setError(error as Error);
    }
  };

  const AlertDescription = () => (
    <div>
      {`This action is`} <strong className='text-destructive'>{` irreversible `}</strong>{` and will delete ${selectedCourse.name} from your list of courses.`}
    </div>
  );

  return role === zSiteRoles.enum.admin && selectedCourseId ? (
    <>
        <AreYouSureDialog
            title={`Are you sure you want to delete ${selectedCourse.name}?`}
            AlertDescriptionComponent={AlertDescription}
            proceedText="DELETE"
            buttonText="Delete"
            bDestructive={true}
            onConfirm={handleConfirmDelete}
        >
            <Button variant="destructive">
              <TrashIcon className="h-4 w-4" />
              <span className='ml-2 hidden sm:flex'>Delete Course</span>
            </Button>
        </AreYouSureDialog>
    </>
  ) : <></>;
};

export default DeleteCourseButton;