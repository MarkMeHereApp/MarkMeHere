import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto, { createHash } from 'crypto';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { Prisma, Organization, CourseMember } from '@prisma/client';
import { defaultSiteSettings } from '@/utils/globalVariables';
import prismaAdapterHashed from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterHashed';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';

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
  const hashFunctions = prismaAdapterHashed(prisma);
  const hashedEmail = createHash('sha256').update(email).digest('hex');
  console.log(hashedEmail);

  const existingUser = await hashFunctions.getUserByEmail(email);

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
      email: existingUser?.email ?? hashedEmail
    }
  });
  return resEnrollment;
}

export type CreateHashedCourseMemberType = (
  courseMember: CourseMemberInput
) => Promise<CourseMember>;

/*************************************************************************************
Grab all courseMembers 
Iterate though coursemembers and find the coursemember with a matching hashed email
*/

export async function findHashedCourseMember(courseId: string, email: string) {
  const members = await prisma.courseMember.findMany({
    where: {
      courseId
    }
  });

  for (const courseMember of members) {
    const isEmailMatch = await bcrypt.compare(email, courseMember.email ?? '');
    if (isEmailMatch) {
      return courseMember;
    }
  }
  return null;
}

export type findHashedCourseMemberType = (
  courseId: string,
  email: string
) => Promise<CourseMember | null>;
