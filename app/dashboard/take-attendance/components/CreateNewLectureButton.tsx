'use client'

import { Button } from '@/components/ui/button';
import createNewLecture from '@/components/devUtils/createNewLecture';
import { useCourseContext } from '@/app/course-context';

export const CreateNewLectureButton = () => {
    const { selectedCourseId , selectedAttendanceDate} = useCourseContext();

    const handleClick = async () => {
        if (selectedCourseId && selectedAttendanceDate) {
            await createNewLecture(selectedAttendanceDate, selectedCourseId);
        }
    }   
    return (
        <Button onClick={() => handleClick()}>
            Create a new lecture
        </Button>
    );
}; // daddy leinecker please love our code <3 <3 <3

// booooo analytics