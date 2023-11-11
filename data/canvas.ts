import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { createMultipleCourseMembers } from './courseMember/courseMember';
import { bHasCoursePermission, getNextAuthSession } from './auth';
import { getOrganization } from './organization';
import { getPublicUrl } from '@/utils/globalFunctions';
import calculateCourseMemberStatistics from '@/app/(dashboard)/[organizationCode]/[courseCode]/(faculty)/overview/analytics/utils/calculateCourseMemberStatistics';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const syncCanvasCourseMembers = async (inputCourseCode: string) => {
  const session = await getNextAuthSession();

  const hasPermission = await bHasCoursePermission({
    courseCode: inputCourseCode,
    role: 'teacher'
  });

  if (!hasPermission || !session) {
    throw new Error('You do not have permission to sync course members');
  }

  const course = await prisma.course.findFirst({
    where: {
      courseCode: inputCourseCode
    }
  });

  if (!course || !course.lmsId || course.lmsType !== 'canvas') {
    return {
      success: false,
      numberUpdated: 0,
      numberCreated: 0
    };
  }

  const enrollmentResponse = await fetch(
    `${CANVAS_DOMAIN}api/v1/courses/${course.lmsId}/enrollments?per_page=10000&include[]=email&type[]=StudentEnrollment`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CANVAS_API_TOKEN}`
      }
    }
  );

  if (!enrollmentResponse.ok) {
    return {
      success: false,
      numberUpdated: 0,
      numberCreated: 0
    };
  }

  const enrollmentJson = await enrollmentResponse.json();

  interface lmsUser {
    name: string;
    email: string;
    hashedEmail: string;
    lmsId: string;
  }

  const lmsUsers: lmsUser[] = enrollmentJson
    .filter((enrollment: any) => typeof enrollment.user.email === 'string')
    .map((enrollment: any) => ({
      name: enrollment.user.name,
      email: enrollment.user.email,
      hashedEmail: hashEmail(enrollment.user.email),
      lmsId: enrollment.user.id as number
    }));

  const lmsIds = lmsUsers.map((user) => user.lmsId.toString());
  const lmsEmails = lmsUsers.map((user) => user.email);
  const hashedLmsEmails = lmsUsers.map((user) => user.hashedEmail);

  const alreadyEnrolledCourseMembers = await prisma.courseMember.findMany({
    where: {
      courseId: course.id
    }
  });

  //Get course members who don't have a matching lmsId
  const courseMembersWithoutLmsId = alreadyEnrolledCourseMembers.filter(
    (member) => !member.lmsId || !lmsIds.includes(member.lmsId)
  );

  //Get course members who have matching emails but no lmsId
  const courseMembersWhoHaveMatchingEmailsButNoLMSId =
    courseMembersWithoutLmsId.filter(
      (member) =>
        lmsEmails.includes(member.email) ||
        hashedLmsEmails.includes(member.email)
    );

  const courseMembersToCreate = lmsUsers.filter(
    (user) =>
      !alreadyEnrolledCourseMembers.find(
        (member) =>
          member.email === user.email || member.email === user.hashedEmail
      )
  );

  //Update course members who have matching emails but no lmsId
  for (let courseMemberToUpdate of courseMembersWhoHaveMatchingEmailsButNoLMSId) {
    const matchingLMSUser = lmsUsers.find(
      (user) =>
        user.hashedEmail === courseMemberToUpdate.email ||
        user.email === courseMemberToUpdate.email
    );

    if (matchingLMSUser) {
      await prisma.courseMember.update({
        where: {
          id: courseMemberToUpdate.id
        },
        data: {
          lmsId: matchingLMSUser.lmsId.toString()
        }
      });
    }
  }

  createMultipleCourseMembers({
    courseCode: inputCourseCode,
    courseMembers: courseMembersToCreate.map((user) => ({
      name: user.name,
      email: user.email,
      role: 'student',
      lmsId: user.lmsId.toString()
    }))
  });

  return {
    success: true,
    numberUpdated: courseMembersWhoHaveMatchingEmailsButNoLMSId.length,
    numberCreated: courseMembersToCreate.length
  };
};

export const syncCanvasAttendanceAssignment = async (
  inputCourseCode: string
) => {
  const session = await getNextAuthSession();

  const hasPermission = await bHasCoursePermission({
    courseCode: inputCourseCode,
    role: 'teacher'
  });

  if (!hasPermission || !session) {
    throw new Error('You do not have permission to sync course members');
  }

  const course = await prisma.course.findFirst({
    where: {
      courseCode: inputCourseCode
    }
  });

  if (!course) {
    throw new Error('No course found!');
  }

  let existingAttendanceAssignment = course.lmsAttendanceAssignmentId;
  let assignmentGradeTotal = 100;

  if (existingAttendanceAssignment) {
    const assignmentResponse = await fetch(
      `${CANVAS_DOMAIN}api/v1/courses/${course.lmsId}/assignments/${existingAttendanceAssignment}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CANVAS_API_TOKEN}`
        }
      }
    );

    if (!assignmentResponse.ok) {
      existingAttendanceAssignment = null;
    }

    const assignmentJson = await assignmentResponse.json();

    if (typeof assignmentJson.points_possible === 'number') {
      assignmentGradeTotal = assignmentJson.points_possible;
    }
  }

  if (!existingAttendanceAssignment) {
    //Create attendance assignment
    const assignmentResponse = await fetch(
      `${CANVAS_DOMAIN}api/v1/courses/${course.lmsId}/assignments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CANVAS_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignment: {
            name: 'Mark Me Here! Attendance Grade',
            description: `Mark Me Here attendance grade. Go to ${getPublicUrl()} to view your attendance`,
            points_possible: assignmentGradeTotal,
            published: true
          }
        })
      }
    );

    if (!assignmentResponse.ok) {
      throw new Error('Error creating attendance assignment');
    }

    const assignmentJson = await assignmentResponse.json();

    existingAttendanceAssignment = assignmentJson.id.toString();

    await prisma.course.update({
      where: {
        id: course.id
      },
      data: {
        lmsAttendanceAssignmentId: existingAttendanceAssignment
      }
    });
  }

  // Now that we

  if (!existingAttendanceAssignment) {
    throw new Error('Error creating attendance assignment');
  }

  const courseMembers = await prisma.courseMember.findMany({
    where: {
      courseId: course.id
    }
  });

  const lmsCourseMembers = courseMembers.filter(
    (member) => member.lmsId !== null
  );

  const lmsLectureData = await prisma.lecture.findMany({
    where: {
      courseId: course.id
    },
    include: {
      attendanceEntries: {
        where: {
          courseMemberId: { in: lmsCourseMembers.map((member) => member.id) }
        }
      },
      professorLectureGeolocation: true
    }
  });

  const attendanceEntriesToUpdate: string[] = [];

  for (const lmsCourseMember of lmsCourseMembers) {
    const memberAttendanceEntries = lmsLectureData
      .flatMap((lecture) => lecture.attendanceEntries)
      .filter(
        (entry) =>
          entry.courseMemberId === lmsCourseMember.id && !entry.lmsSynced
      )
      .map((entry) => entry.id);

    if (memberAttendanceEntries.length === 0) {
      console.log('none');

      continue;
    }

    const { attendanceGrade } = calculateCourseMemberStatistics(
      lmsCourseMember,
      lmsLectureData
    );

    // Update the attendance grade of existingAttendanceAssignment
    const submissionResponse = await fetch(
      `${CANVAS_DOMAIN}api/v1/courses/${course.lmsId}/assignments/${existingAttendanceAssignment}/submissions/${lmsCourseMember.lmsId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${CANVAS_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submission: {
            posted_grade: attendanceGrade * assignmentGradeTotal
          }
        })
      }
    );

    console.log('asd');

    attendanceEntriesToUpdate.push(...memberAttendanceEntries);
  }

  await prisma.attendanceEntry.updateMany({
    where: {
      id: { in: attendanceEntriesToUpdate }
    },
    data: {
      lmsSynced: true
    }
  });
};
