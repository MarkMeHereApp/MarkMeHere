'use client';

import { useCourseContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-course';
import Loading from '@/components/general/loading';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { toastError, toastSuccess } from '../globalFunctions';
import {
  syncCanvasAttendanceAssignment,
  syncCanvasCourseMembers
} from '@/data/canvas';
import { useLecturesContext } from '@/app/(dashboard)/[organizationCode]/[courseCode]/context-lecture';
import { CheckIcon } from '@radix-ui/react-icons';

export const SyncCanvasGrade = () => {
  const {
    selectedCourse,
    courseMembersOfSelectedCourse,
    setCourseMembersOfSelectedCourse
  } = useCourseContext();

  const [loading, setLoading] = useState(false);

  if (!selectedCourse.lmsId || !courseMembersOfSelectedCourse) {
    return <></>;
  }

  const userWithLmsId = courseMembersOfSelectedCourse.find(
    (member) => member.lmsId
  );

  if (!userWithLmsId) {
    return <></>;
  }

  if (false) {
    return (
      <Button variant={'outline'} disabled={true}>
        <CheckIcon className="h-6 w-6 " />
        <span className="whitespace-nowrap ml-2 hidden md:flex">
          Synced With Canvas
        </span>
      </Button>
    );
  }

  const onSyncCanvasGrade = async () => {
    try {
      if (!courseMembersOfSelectedCourse) {
        return;
      }
      setLoading(true);

      if (!selectedCourse) {
        throw new Error('Selected ID is undefined.');
      }

      const response = await syncCanvasAttendanceAssignment(
        selectedCourse.courseCode
      );

      if (response?.createdNewAssignment) {
        toastSuccess('Created new attendance assignment in Canvas and synced.');
      } else {
        toastSuccess("Updated everyone's attendance grades.");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toastError('Could not sync with Canvas');
    }
  };

  return (
    <div>
      <div>
        <Button
          variant={'outline'}
          disabled={loading}
          onClick={onSyncCanvasGrade}
        >
          {loading ? (
            <Loading name="Syncing" />
          ) : (
            <>
              <Icons.canvas className="h-6 w-6 text-destructive " />
              <span className="whitespace-nowrap ml-2 hidden md:flex">
                Sync Grades
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
