'use server';
import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { createMultipleCourseMembers } from '../courseMember/create-multiple-course-members';
import { bHasCoursePermission, ensureAndGetNextAuthSession } from '../auth';
import { decrypt, getPublicUrl } from '@/utils/globalFunctions';
import calculateCourseMemberStatistics from '@/app/(dashboard)/[organizationCode]/[courseCode]/(faculty)/overview/analytics/utils/calculateCourseMemberStatistics';
import { CourseMember } from '@prisma/client';

export const syncCanvasCourseMembers = async (inputCourseCode: string) => {
  const session = await ensureAndGetNextAuthSession();

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
      updatedUsers: [],
      createdUsers: []
    };
  }

  const organization = await prisma.organization.findFirst({
    where: {
      uniqueCode: course.organizationCode
    },
    select: {
      canvasDevKeyAuthorizedEmail: true
    }
  });

  if (!organization) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  if (organization.canvasDevKeyAuthorizedEmail !== session.user.email) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    },
    select: {
      canvasUrl: true,
      canvasToken: true
    }
  });

  if (!user || !user.canvasUrl || !user.canvasToken) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  const CANVAS_DOMAIN = user.canvasUrl;
  const CANVAS_API_TOKEN = decrypt(user.canvasToken);

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
    throw new Error("Couldn't find enrollments");
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

  // If a course member has an lmsId but it's not in the list of lmsIds, remove it.
  const incorrectLmsIdCourseMembers = alreadyEnrolledCourseMembers.filter(
    (member) => member.lmsId && !lmsIds.includes(member.lmsId)
  );

  const updatedCourseMembers: Map<string, CourseMember> = new Map();

  for (let member of incorrectLmsIdCourseMembers) {
    const updatedMember = await prisma.courseMember.update({
      where: {
        id: member.id
      },
      data: {
        lmsId: null
      }
    });
    updatedCourseMembers.set(updatedMember.id, updatedMember);
  }

  //Get course members who have matching emails but the wrong lmsIdm, we need to update their lmsId
  const courseMembersWithoutLmsId = alreadyEnrolledCourseMembers.filter(
    (member) => !member.lmsId || !lmsIds.includes(member.lmsId)
  );

  const courseMembersWhoHaveMatchingEmailsButWrongLMSId =
    courseMembersWithoutLmsId.filter(
      (member) =>
        lmsEmails.includes(member.email) ||
        hashedLmsEmails.includes(member.email)
    );

  //Update course members who have matching emails but no lmsId
  for (let courseMemberToUpdate of courseMembersWhoHaveMatchingEmailsButWrongLMSId) {
    const matchingLMSUser = lmsUsers.find(
      (user) =>
        user.hashedEmail === courseMemberToUpdate.email ||
        user.email === courseMemberToUpdate.email
    );

    if (matchingLMSUser) {
      const updatedMember = await prisma.courseMember.update({
        where: {
          id: courseMemberToUpdate.id
        },
        data: {
          lmsId: matchingLMSUser.lmsId.toString()
        }
      });

      updatedCourseMembers.set(updatedMember.id, updatedMember);
    }
  }

  // Get the course members who are not already enrolled
  const courseMembersToCreate = lmsUsers.filter(
    (user) =>
      !alreadyEnrolledCourseMembers.find(
        (member) =>
          member.email === user.email || member.email === user.hashedEmail
      )
  );

  const { allCourseMembersOfClass } = await createMultipleCourseMembers({
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
    updatedUsers: Array.from(updatedCourseMembers.values()),
    createdUsers: allCourseMembersOfClass
  };
};

export const syncCanvasAttendanceAssignment = async (
  inputCourseCode: string
) => {
  const session = await ensureAndGetNextAuthSession();

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

  const organization = await prisma.organization.findFirst({
    where: {
      uniqueCode: course.organizationCode
    },
    select: {
      canvasDevKeyAuthorizedEmail: true
    }
  });

  if (!organization) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  if (organization.canvasDevKeyAuthorizedEmail !== session.user.email) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email
    },
    select: {
      canvasUrl: true,
      canvasToken: true
    }
  });

  if (!user || !user.canvasUrl || !user.canvasToken) {
    return {
      success: false,
      updatedUsers: [],
      createdUsers: []
    };
  }

  const CANVAS_DOMAIN = user.canvasUrl;
  const CANVAS_API_TOKEN = decrypt(user.canvasToken);

  let existingAttendanceAssignment = course.lmsAttendanceAssignmentId;
  let assignmentGradeTotal = 100;

  if (existingAttendanceAssignment) {
    // Make sure the assignment exists
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

  let createdNewAssignment = false;
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

    createdNewAssignment = true;

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

    attendanceEntriesToUpdate.push(...memberAttendanceEntries);
  }
  return {
    success: true,
    createdNewAssignment: createdNewAssignment
  };
};
