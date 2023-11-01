import prisma from '@/prisma';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';
import prismaAdapterDefault from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterDefault';
import { CourseMember } from '@prisma/client';
import { findUser, hashEmail } from './userHelpers';

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

export async function createCourseMember(
  courseMember: CourseMemberInput
) {
  const { name, email } = courseMember;
  const existingUser = await findUser(email);

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

export async function findCourseMember(
  email: string,
  courseId?: string
) {
  const where = courseId ? { courseId, email } : { email };
  return await prisma.courseMember.findFirst({
    where
  });
}

export type findDefaultCourseMemberType = (
  email: string,
  courseId?: string
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

export async function updateCourseMember(id: string, memberData: MemberData) {
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

/*************************************************************************************
Search for user with matching course member email (bcrypt)
If user exists create the courseMember
If user does not exist create the user and the course member
*/
  
  export async function createHashedCourseMember(
    courseMember: CourseMemberInput
  ) {
    const { name, email } = courseMember;
    const hashedEmail = hashEmail(email);
    const existingUser = await findUser(hashedEmail);
    console.log(existingUser);
  
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: name,
          email: hashedEmail,
          role: zSiteRoles.enum.user
        }
      });
    }
  
    const resEnrollment = await prisma.courseMember.create({
      data: {
        ...courseMember,
        email: hashedEmail
      }
    });
    return resEnrollment;
  }
  
  export type CreateHashedCourseMemberType = (
    courseMember: CourseMemberInput
  ) => Promise<CourseMember>;
  
  /*************************************************************************************
  Search for course member with matching hashed user email
  */
  
  export async function findHashedCourseMember(email: string, courseId?: string) {
    const where = courseId ? { courseId, email } : { email };
    return await prisma.courseMember.findFirst({ where });
  }
  
  export type findHashedCourseMemberType = (
    email: string,
    courseId?: string
  ) => Promise<CourseMember | null>;
