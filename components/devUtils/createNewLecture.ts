import { trpc } from "@/app/_trpc/client";
import { toast } from "@/components/ui/use-toast";

const createNewLecture = async (selectedAttendanceDate: Date, selectedCourseId: string) => {
    const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();
    await createNewLectureMutation.mutateAsync({
        courseId: selectedCourseId || '',
        lectureDate: selectedAttendanceDate || new Date(),
    });
    toast({
        title: `Successfully created a new lecture for ${selectedAttendanceDate}`
    });
}

export default createNewLecture;