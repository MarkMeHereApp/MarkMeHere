import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/prisma';

import 'server-only';
import { zCourseRolesType } from '@/types/sharedZodTypes';

// Returns the session if it is the specified role, otherwise throws an error
export const ensureAndGetNextAuthSession = async () => {
  const authOptions = await getAuthOptions();

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error('No session found!');
  }

  return session;
};

export const bHasCoursePermission = async ({
  courseCode,
  role
}: {
  courseCode: string;
  role: zCourseRolesType;
}) => {
  const authOptions = await getAuthOptions();

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('No session found!');
  }

  const course = await prisma.course.findFirst({
    where: {
      courseCode: courseCode
    }
  });

  if (!course) {
    throw new Error('No course found!');
  }

  const courseMember = await prisma.courseMember.findFirst({
    where: {
      courseId: course.id,
      email: session.user.email,
      role: role
    }
  });

  return !!courseMember;
};
