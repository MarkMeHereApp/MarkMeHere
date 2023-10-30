import prisma from '@/prisma';
import { CourseMember } from '@prisma/client';
import { createHash } from 'crypto';
import bcrypt from 'bcrypt';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';
import { findHashedUser, hashEmail } from './hashedUserHelpers';

/*************************************************************************************
Search for user with matching course member email (bcrypt)
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

export async function createHashedCourseMember(
  courseMember: CourseMemberInput
) {
  const { name, email } = courseMember;
  const hashedEmail = hashEmail(email);
  const existingUser = await findHashedUser(hashedEmail);
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
