'use client';

import { Button } from '@/components/ui/button';
import { useCourseContext } from '@/app/course-context';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';

export const CreateNewLectureButton = () => {
  const { selectedCourseId, selectedAttendanceDate } = useCourseContext();
  const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();

  const handleClick = async () => {
    if (selectedCourseId && selectedAttendanceDate) {
      await createNewLectureMutation.mutateAsync({
        courseId: selectedCourseId || '',
        lectureDate: selectedAttendanceDate || new Date()
      });
      toast({
        title: `Successfully created a new lecture for ${selectedAttendanceDate}`
      });
    }
  };
  return <Button onClick={() => handleClick()}>Create a new lecture</Button>;
};
