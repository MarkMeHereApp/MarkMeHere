import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { TrashIcon } from '@radix-ui/react-icons';

import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { CourseMember } from '@prisma/client';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { selectedCourseId, setCourseMembersOfSelectedCourse } =
    useCourseContext();
  const deleteCourseMemberMutation =
    trpc.courseMember.deleteCourseMember.useMutation();
  const getCourseMembersOfCourseQuery =
    trpc.courseMember.getCourseMembersOfCourse.useQuery(
      {
        courseId: selectedCourseId || ''
      },
      {
        onSuccess: (data) => {
          if (!data) return;
          setCourseMembersOfSelectedCourse(data.courseMembers);
        }
      }
    );

  const session = useSession();
  const userEmail = session.data?.user?.email;

  const courseMemberData = row.original as CourseMember;

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  async function handleConfirmDelete() {
    await deleteCourseMemberMutation.mutateAsync({
      ...courseMemberData
    });
    handleDialogClose();
    await getCourseMembersOfCourseQuery.refetch();
    toast({
      title: `Successfully deleted ${courseMemberData.name}`
    });
  }
  return (
    <>
      <Dialog open={isDialogOpen}>
        <DialogTrigger onClick={() => handleDialogOpen()} asChild>
          {userEmail !== courseMemberData.email && (
            <TrashIcon className="h-4 w-4 text-red-500 hover:text-red-700 transition-colors hover:cursor-pointer" />
          )}
        </DialogTrigger>
        <DialogContent onClose={() => handleDialogClose()}>
          <DialogHeader>
            <DialogHeader>
              <DialogTitle>Confirm Data Deletion</DialogTitle>
              <DialogDescription>
                This action is irreversible. Are you certain you wish to
                permanently delete all data related to{' '}
                <span className="underline text-red-500">
                  {`${courseMemberData.name}`}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => {
                handleConfirmDelete();
              }}
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                handleDialogClose();
              }}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
