import { useSession } from 'next-auth/react';
import * as z from 'zod';
import { useState } from 'react';
import { trpc } from '@/app/_trpc/client';
import { toast } from '@/components/ui/use-toast';
import { useCourseContext } from '@/app/context-course';
import { zLMSProvider, zCourseRoles } from '@/types/sharedZodTypes';
import { toastError } from '@/utils/globalFunctions';
import { TRPCClientError } from '@trpc/client';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';
import { CourseMember } from '@prisma/client';
import { useLecturesContext } from '@/app/context-lecture';
import { Lecture, AttendanceEntry } from '@prisma/client';
import { setHours } from 'date-fns';

const CreateCourseFormSchema = z.object({
  courseCode: z
    .string()
    .min(2, {
      message: 'Course Label must be at least 2 characters.'
    })
    .max(255, {
      message: 'Course Label must not be longer than 255 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Label cannot contain double spaces'
    })
    .transform((val) => val.trim())
    .transform((val) => val.toUpperCase()),
  name: z
    .string()
    .min(2, {
      message: 'Course Name must be at least 2 characters.'
    })
    .max(255, {
      message: 'Course Name must not be longer than 255 characters.'
    })
    .refine((value) => !/\s\s/.test(value), {
      message: 'Course Name cannot contain double spaces'
    })
    .transform((val) => val.trim()),
  lmsId: z.string().optional().nullable(),
  lmsType: zLMSProvider,
  autoEnroll: z.boolean().default(true)
});
type CourseFormSchema = z.infer<typeof CreateCourseFormSchema>;

const GenerateCourseForm = () => {
  const courseForm: CourseFormSchema = {
    courseCode: faker.string.uuid(),
    name:
      'RandomlyGeneratedCourse:' + faker.string.sample({ min: 5, max: 100 }),
    lmsType: 'none',
    autoEnroll: true
  };
  return courseForm;
};

const createRandomCourseMember = (selectedCourseId: string) =>
  ({
    id: faker.string.uuid(),
    lmsId: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    courseId: selectedCourseId,
    dateEnrolled: new Date(),
    role: zCourseRoles.enum.student
  }) as CourseMember;

export default function GenerateCourseAsProfessor() {
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const createCourseMutation = trpc.course.createCourse.useMutation();
  const {
    courseMembersOfSelectedCourse,
    setUserCourses,
    setUserCourseMembers,
    setSelectedCourseId,
    setCourseMembersOfSelectedCourse
  } = useCourseContext();
  const { setLectures, lectures } = useLecturesContext();
  const [error, setError] = useState<Error | null>(null);
  const createManyCourseMembers =
    trpc.courseMember.createMultipleCourseMembers.useMutation();
  const createNewLectureMutation = trpc.lecture.CreateLecture.useMutation();
  const createNewAttendanceEntryMutation =
    trpc.attendance.createManyAttendanceRecords.useMutation();
  async function handleClick() {
    toast({
      title: 'Generating Populated Course, wait until success toast!',
      icon: 'success'
    });
    setLoading(true);
    const sessionData = session.data;
    if (!sessionData) {
      setError(new Error('SessionData is undefined.'));
      return;
    }
    const courseform = GenerateCourseForm();

    const userFullName = sessionData?.user?.name;
    const userEmail = sessionData?.user?.email;
    if (!userFullName || !userEmail) {
      setError(new Error('User name or email is undefined.'));
      return;
    }
    try {
      const handleCreateCourseResult = await createCourseMutation.mutateAsync({
        newCourseData: {
          courseCode: courseform.courseCode,
          name: courseform.name,
          lmsId: courseform.lmsId || undefined,
          lmsType: courseform.lmsType
        },
        autoEnroll: courseform.autoEnroll,
        newMemberData: {
          email: userEmail,
          name: userFullName,
          role: zCourseRoles.enum.teacher
        }
      });

      if (!handleCreateCourseResult.resCourse) {
        setError(
          //prettier-ignore
          new Error('Unexpected server error: No course returned from createCourseMutation.')
        );
        return;
      }

      const newEnrollment = handleCreateCourseResult.resEnrollment;
      const newCourse = handleCreateCourseResult.resCourse;

      setUserCourses((userCourses) => [...(userCourses || []), newCourse]);
      setSelectedCourseId(newCourse.id);
      setLectures([]);
      // Populated with students
      const generateCourseMembers = async (listStudents: any) => {
        const newMembers = await createManyCourseMembers.mutateAsync({
          courseId: newCourse.id,
          courseMembers: listStudents
        });
        return newMembers;
      };

      const numStudents = faker.number.int({ min: 100, max: 1000 });
      const listStudents = [];
      for (let i = 0; i < numStudents; i++) {
        listStudents.push(createRandomCourseMember(newCourse.id));
      }
      const resStudents = await generateCourseMembers(listStudents);
      setCourseMembersOfSelectedCourse(resStudents.allCourseMembersOfClass);
      toast({ title: 'Created ' + numStudents + ' New Students!' });

      // Populate with random lecture data
      function generateUniqueRandomDate(
        existingDates: Date[],
        minDate: Date,
        maxDate: Date
      ) {
        let randomDate;
        do {
          randomDate = faker.date.between({ from: minDate, to: maxDate });
        } while (existingDates.includes(randomDate));

        return randomDate;
      }
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const pastMonth = new Date(currentDate);
      pastMonth.setMonth(currentDate.getMonth() - 1);
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(currentDate.getMonth() + 1);
      const numberOfDatesToGenerate = faker.number.int({ min: 5, max: 10 });
      const uniqueDates = [];
      uniqueDates.push(currentDate);
      while (uniqueDates.length < numberOfDatesToGenerate) {
        const randomDate = generateUniqueRandomDate(
          uniqueDates,
          pastMonth,
          nextMonth
        );
        randomDate.setHours(0, 0, 0, 0);
        uniqueDates.push(randomDate);
      }
      toast({ title: 'Creating ' + uniqueDates.length + ' New Lectures!' });

      for (const currentLectureDate of uniqueDates) {
        const newLecture = await createNewLectureMutation.mutateAsync({
          courseId: newCourse.id,
          lectureDate: currentLectureDate
        });
        if (!lectures) throw new Error('Unexpected server error.');

        // populate with random attendance data
        const numUpdatedStudents = faker.number.int({
          min: 100,
          max: numStudents
        });

        // Shuffle the array
        const shuffledMembers = [...resStudents.allCourseMembersOfClass];
        for (let i = shuffledMembers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledMembers[i], shuffledMembers[j]] = [
            shuffledMembers[j],
            shuffledMembers[i]
          ];
        }

        // Take the first numUpdatedStudents members
        const courseMemberIds = shuffledMembers
          .slice(0, numUpdatedStudents)
          .map((member) => member.id);
        const newAttendanceEntries =
          await createNewAttendanceEntryMutation.mutateAsync({
            lectureId: newLecture.newLecture.id,
            attendanceStatus: 'here',
            courseMemberIds: courseMemberIds
          });
        const newLectures = [
          ...lectures,
          {
            attendanceEntries: newAttendanceEntries.updatedAttendanceEntries,
            ...newLecture.newLecture
          }
        ];
        setLectures(newLectures);
        toast({
          title: `Created ${numUpdatedStudents} New Attendance Entries for lecutre ${currentLectureDate}!`
        });
      }
      toast({
        title: 'Successfully Generated New Course!',
        icon: 'success'
      });
      window.location.reload();
      setLoading(false);
      return;
    } catch (error) {
      setError(error as Error);
      return;
    }
  }

  return (
    <Button variant="default" onClick={handleClick}>
      GenerateCourseAsProfessor
    </Button>
  );
}
