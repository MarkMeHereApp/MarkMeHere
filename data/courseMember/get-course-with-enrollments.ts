import 'server-only';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { z } from 'zod'; // Assuming you're using zod for schema validation
import { getOrganization } from '../organization/organization';
import { bHasCoursePermission, ensureAndGetNextAuthSession } from '../auth';
import { zSiteRoles } from '@/types/sharedZodTypes';

export const zGetCourseMembersOfCourse = z.object({
  courseCode: z.string()
});

export const getCourseWithEnrollments = async (
  requestData: z.infer<typeof zGetCourseMembersOfCourse>
) => {
  try {
    const session = await ensureAndGetNextAuthSession();

    const hasPermission = await bHasCoursePermission({
      courseCode: requestData.courseCode,
      role: 'teacher'
    });

    const isAdmin = session.user.role === zSiteRoles.enum.admin;

    const course = await prisma.course.findFirst({
      where: {
        courseCode: requestData.courseCode
      },
      include: {
        enrollments: {
          where: {
            ...(hasPermission || isAdmin ? {} : { email: session.user.email })
          }
        }
      }
    });

    return {
      success: true,
      course: course
    };
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
