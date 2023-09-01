import { NextResponse } from 'next/server';
import { Course, CourseMember } from '@prisma/client';
import prisma from '@/prisma';

// Creates a new course and optionally enrolls the user making the request
// Parameters: Request object with course data and optional enrollment flag
// The request body should include:
// - courseData: Object with course details
// - enroll: Boolean flag indicating whether to enroll the user
// - email: Email of the user to be enrolled (if enroll is true)
// - name: Name of the user to be enrolled (if enroll is true)
// - role: Role of the user in the course (if enroll is true)
// Response: JSON object with success status, created course data, and course enrollment object
// The response body will include:
// - success: Boolean indicating the success status
// - course: Object with the created course details (if successful)
// - enrollment: Object with the course enrollment details (if enroll is true and successful)
// - error: String with error message (if not successful)
export async function POST(request: Request) {
  const requestData = await request.json();
  let course = null;
  let enrollment = null;

  let resCourse: Course | null = null;
  let resEnrollment: CourseMember | null = null;

  try {
    course = await prisma.course.create({
      data: {
        ...requestData.courseData
      }
    });

    resCourse = {
      id: course.id,
      courseLabel: course.courseLabel,
      name: course.name,
      lmsId: course.lmsId ?? null,
      dateCreated: new Date(),
      StartDate: course.StartDate ?? null,
      EndDate: course.EndDate ?? null
    };
  } catch (error) {
    console.log(error);
    console.error('Error creating course:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating course'
    });
  }

  // Check if enrollment flag is true
  if (requestData.enroll) {
    try {
      // Create a new enrollment record for the user
      enrollment = await prisma.courseMember.create({
        data: {
          courseId: course.id,
          email: requestData.email,
          name: requestData.name,
          role: requestData.role
        }
      });

      resEnrollment = {
        id: enrollment.id,
        courseId: enrollment.courseId,
        email: enrollment.email,
        name: enrollment.name ?? '',
        role: enrollment.role,
        lmsId: enrollment.lmsId ?? ''
      };
    } catch (error) {
      console.error('Error creating enrollment:', error);
      return NextResponse.json({
        success: false,
        error: 'Error: Created course but failed to enroll user'
      });
    }
  }

  return NextResponse.json({ success: true, resCourse, resEnrollment });
}
// Returns all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ name: 'asc' }]
    });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json({
      success: false,
      error: 'Error getting courses'
    });
  }
}

// Deletes a course and returns the remaining courses
export async function DELETE(request: Request) {
  try {
    const requestData = await request.json();
    await prisma.course.delete({
      where: {
        id: requestData.id
      }
    });
    const courses = await prisma.course.findMany({
      orderBy: [{ name: 'asc' }]
    });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({
      success: false,
      error: 'Error deleting course'
    });
  }
}
