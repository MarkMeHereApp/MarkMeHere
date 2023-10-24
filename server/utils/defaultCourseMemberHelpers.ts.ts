import prisma from '@/prisma';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';
import prismaAdapterDefault from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterDefault';
import { CourseMember } from '@prisma/client';

/*************************************************************************************
Search for user with matching course member email 
If user exists create the courseMember
If user does not exist create the user and the course member
*/

export type CourseMemberInput = {
  name: string;
  email: string;
  role: zCourseRolesType;
  courseId: string;
  lmsId?: string;
  optionalId?: string;
};

export async function createDefaultCourseMember(
  courseMember: CourseMemberInput
) {
  const { name, email } = courseMember;
  const defaultFunctions = prismaAdapterDefault(prisma);

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
}

export type CreateDefaultCourseMemberType = (
  courseMember: CourseMemberInput
) => Promise<CourseMember>;

/*************************************************************************************
Search for course member with matching user email
*/
export async function findDefaultCourseMember(courseId: string, email: string) {
  const courseMember = await prisma.courseMember.findFirst({
    where: {
      courseId,
      email
    }
  });
  return courseMember;
}

export type findDefaultCourseMemberType = (
  courseId: string,
  email: string
) => Promise<CourseMember | null>;

/*************************************************************************************
Update existing course member
*/

export type MemberData = {
  name: string;
  email: string;
  role: zCourseRolesType;
  optionalId?: string;
};

export async function updateCourseMember(
  id: string,
  memberData: MemberData
) {
  const courseMember = await prisma.courseMember.update({
    where: { id },
    data: memberData
  });
  return courseMember;
}

export type updateDefaultCourseMemberType = (
  id: string,
  memberData: MemberData
) => Promise<CourseMember | null>;
