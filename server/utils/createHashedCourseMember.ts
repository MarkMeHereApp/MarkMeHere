import { toast } from '@/components/ui/use-toast';
import { ToastActionElement } from '@/components/ui/toast';
import crypto from 'crypto';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { Prisma, GlobalSiteSettings, CourseMember } from '@prisma/client';
import { defaultSiteSettings } from '@/utils/globalVariables';
import prismaAdapterHashed from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterHashed';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';

type CourseMemberInput = {
  name: string;
  email: string;
  role: zCourseRolesType;
  courseId: string;
  lmsId?: string;
  optionalId?: string;
};

type CreateHashedCourseMemberFunction = (
  courseMember: CourseMemberInput
) => Promise<false | CourseMember>;

export type createHashedCourseMemberType = CreateHashedCourseMemberFunction;

export default async function createHashedCourseMember(
  courseMember: CourseMemberInput
) {
  try {
    console.log('Successfully reading site settings from context');
    const { name, email } = courseMember;
    const hashFunctions = prismaAdapterHashed(prisma);
    const hashedEmail = await bcrypt.hash(email, 10);

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
  } catch (error) {
    // Handle the error here (e.g., log it, throw a custom error, or return false).
    console.error('Error in createHashedCourseMember:', error);
    return false;
  }
}
