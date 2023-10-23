import prisma from '@/prisma';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';
import prismaAdapterDefault from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterDefault';
import { CourseMember } from '@prisma/client';

type CourseMemberInput = {
  name: string;
  email: string;
  role: zCourseRolesType;
  courseId: string;
  lmsId?: string;
  optionalId?: string;
};

/* 
Search for user with matching course member email 
If user exists create the courseMember
If user does not exist create the user and the course member
*/
type CreateDefaultCourseMemberFunction = (
  courseMember: CourseMemberInput
) => Promise<CourseMember>;

export type createDefaultCourseMemberType = CreateDefaultCourseMemberFunction;

export default async function createDefaultCourseMember(
  courseMember: CourseMemberInput
) {
  const { name, email } = courseMember;
  const defaultFunctions = prismaAdapterDefault(prisma);

  try {
    const existingUser = await defaultFunctions.getUserByEmail(email);

    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: name,
          email: email,
          role: zSiteRoles.enum.user
        }
      });
    }

    const resEnrollment = await prisma.courseMember.create({
      data: {
        ...courseMember,
        email
      }
    });
    return resEnrollment;
  } catch (error) {
    // Handle the error here (e.g., log it, throw a custom error, or return false).
    console.error('Error in createCourseMember:', error);
    return false;
  }
}
