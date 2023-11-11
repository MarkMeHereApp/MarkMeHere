'use client';

import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import Loading from '@/components/general/loading';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { toastError, toastSuccess } from '../globalFunctions';
import { syncCanvasCourseMembers } from '@/data/canvas';

export const SyncCanvasUsers = () => {
  const {
    selectedCourse,
    courseMembersOfSelectedCourse,
    setCourseMembersOfSelectedCourse
  } = useCourseContext();
  const [loading, setLoading] = useState(false);

  if (!selectedCourse.lmsId) {
    return <></>;
  }

  const onSyncCanvasUsers = async () => {
    try {
      if (!courseMembersOfSelectedCourse) {
        return;
      }
      setLoading(true);

      if (!selectedCourse) {
        throw new Error('Selected ID is undefined.');
      }

      const { updatedUsers, createdUsers } = await syncCanvasCourseMembers(
        selectedCourse.courseCode
      );

      const unaffectedCourseMembers = courseMembersOfSelectedCourse.filter(
        (member) => {
          return (
            !updatedUsers.find((updatedUser) => updatedUser.id === member.id) &&
            !createdUsers.find((createdUser) => createdUser.id === member.id)
          );
        }
      );
      setCourseMembersOfSelectedCourse([
        ...unaffectedCourseMembers,
        ...updatedUsers,
        ...createdUsers
      ]);

      let creationMessage = '';
      if (createdUsers.length > 0) {
        creationMessage = `Successfully created ${createdUsers.length} users. `;
      }

      let updateMessage = '';
      if (updatedUsers.length > 0) {
        updateMessage = `Successfully updated ${updatedUsers.length} users. `;
      }

      if (updatedUsers.length === 0 && createdUsers.length === 0) {
        toastSuccess(`Everything was already up to date.`);
      } else {
        toastSuccess(creationMessage + updateMessage);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastError('Could not sync with Canvas');
    }
  };

  return (
    <Button variant={'outline'} disabled={loading} onClick={onSyncCanvasUsers}>
      {loading ? (
        <Loading name="Syncing" />
      ) : (
        <>
          <Icons.canvas className="h-6 w-6 text-destructive " />
          <span className="whitespace-nowrap ml-2 hidden sm:flex">
            Sync Users
          </span>
        </>
      )}
    </Button>
  );
};
