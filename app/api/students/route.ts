import { NextResponse } from 'next/server';
import { Student } from '@/utils/sharedTypes';
import prisma from '@/prisma';

const getAllStudentsFromCourse = async (
  courseId: string
): Promise<Student[]> => {
  const students = await prisma.courseMember.findMany({
    where: {
      courseId: {
        equals: courseId
      }
    },
    orderBy: [{ lastName: 'asc' }]
  });
  return students;
};

export interface StudentResponse {
  students: Student[];
  courseId: string;
}

// Returns an array of the students with the new student added
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const courseId = requestData.courseId;
    const student = await prisma.courseMember.create({
      data: {
        ...requestData.student,
        dateCreated: new Date(Date.now())
      }
    });
    if (student) {
      const students = await getAllStudentsFromCourse(courseId);
      const response: StudentResponse = {
        students: students,
        courseId
      };
      return NextResponse.json({ success: true, ...response });
    }
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}

// Returns all students
export async function GET(request: Request) {
  try {
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const courseId = queryParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Missing courseId' });
    }

    const students = await getAllStudentsFromCourse(courseId);
    const response = {
      students: students,
      courseId: courseId
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error getting students:', error);
    return NextResponse.json({
      success: false,
      error: 'Error getting students'
    });
  }
}

// Deletes all students and returns an empty array.
// Need to add further functionality so that we can either delete a single student or all students.
export async function DELETE(request: Request) {
  try {
    const requestData = await request.json();
    const courseId = requestData.courseId;
    const requestStudents = requestData as Student[];

    for (const student of requestStudents) {
      await prisma.courseMember.delete({
        where: {
          id: student.id,
          courseId
        }
      });
    }

    const students = await getAllStudentsFromCourse(courseId);
    const response: StudentResponse = {
      students: students,
      courseId
    };
    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error deleting student(s):', error);
    return NextResponse.json({
      success: false,
      error: 'Error deleting student(s)'
    });
  }
}
