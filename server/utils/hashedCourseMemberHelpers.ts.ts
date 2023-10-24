import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto from 'crypto';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { Prisma, GlobalSiteSettings, CourseMember } from '@prisma/client';
import { defaultSiteSettings } from '@/utils/globalVariables';
import prismaAdapterHashed from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterHashed';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';

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
  const hashedEmail = await bcrypt.hash(email, 10);
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
