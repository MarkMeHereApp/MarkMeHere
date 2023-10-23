import prisma from '@/prisma';
import { zCourseRolesType, zSiteRoles } from '@/types/sharedZodTypes';
import prismaAdapterDefault from '@/app/api/auth/[...nextauth]/adapters/prismaAdapterDefault';

type CourseMemberInput = {
  name: string;
  email: string;
  role: zCourseRolesType;
  courseId: string;
  lmsId?: string;
  optionalId?: string;
};

export default async function createDefaultCourseMember(
  courseMember: CourseMemberInput
) {
  console.log('Successfully reading site settings from context');
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

    // const resEnrollment = await prisma.courseMember.create({
    //   data: {
    //     ...courseMember,
    //     email: existingUser?.email ?? hashedEmail
    //   }
    // });
    return true;
  } catch (error) {
    // Handle the error here (e.g., log it, throw a custom error, or return false).
    console.error('Error in createCourseMember:', error);
    return false;
  }
}
