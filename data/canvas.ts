import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { createMultipleCourseMembers } from './courseMember/courseMember';

const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;

export const syncCanvasCourseMembers = async (inputCourseCode: string) => {
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
    `${CANVAS_DOMAIN}api/v1/courses/${course.lmsId}/enrollments?per_page=10000&include[]=email`,
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

export const syncCanvasCourseAttendance = async (inputCourseCode: string) => {};
