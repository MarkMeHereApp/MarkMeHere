import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { generateTypedError } from '@/server/errorTypes';
import { z } from 'zod'; // Assuming you're using zod for schema validation
import { getOrganization } from '../organization';
import { bHasCoursePermission, getNextAuthSession } from '../auth';
import { zCourseRoles } from '@/types/sharedZodTypes';
import {
  createCourseMember,
  findCourseMember,
  updateCourseMember
} from '@/server/utils/courseMemberHelpers';

export const zCreateMultipleCourseMembers = z.object({
  courseCode: z.string(),
  courseMembers: z.array(
    z.object({
      optionalId: z.string().optional(),
      name: z.string(),
      email: z.string(),
      role: zCourseRoles,
      lmsId: z.string().optional()
    })
  )
});

export const createMultipleCourseMembers = async (
  requestData: z.infer<typeof zCreateMultipleCourseMembers>
) => {
  try {
    const { courseCode, courseMembers } = requestData;

    const session = await getNextAuthSession();
    const organization = await getOrganization();

    const hasPermission = await bHasCoursePermission({
      courseCode: courseCode,
      role: 'teacher'
    });

    if (!hasPermission || !session) {
      throw new Error('You do not have permission to sync course members');
    }

    const course = await prisma.course.findFirst({
      where: {
        courseCode: requestData.courseCode
      }
    });

    if (!course) {
      throw new Error('No course found!');
    }

    const { hashEmails } = organization;
    const updatedCourseMembers = [];

    // Filter out the course members with email matching session.user
    const filteredCourseMembers = courseMembers.filter(
      (memberData) => memberData.email !== session.user.email
    );
    // Create an array to store promises for member creation or update
    const memberPromises = filteredCourseMembers.map(async (memberData) => {
      memberData.email = hashEmails
        ? hashEmail(memberData.email)
        : memberData.email;

      const existingMember = await findCourseMember(
        memberData.email,
        course.id
      );

      if (existingMember) {
        return updateCourseMember(existingMember.id, memberData);
      } else {
        return createCourseMember({ ...memberData, courseId: course.id });
      }
    });

    const courseMemberResults = await Promise.all(memberPromises);
    updatedCourseMembers.push(...courseMemberResults);

    return {
      success: true,
      allCourseMembersOfClass: updatedCourseMembers
    };
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
