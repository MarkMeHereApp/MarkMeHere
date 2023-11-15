'use server';

import 'server-only';
import prisma from '@/prisma';
import { hashEmail } from '@/server/utils/userHelpers';
import { generateTypedError } from '@/server/errorTypes';
import { z } from 'zod'; // Assuming you're using zod for schema validation
import { getOrganization } from '../organization/organization';
import { bHasCoursePermission, ensureAndGetNextAuthSession } from '../auth';
import { zCourseRoles } from '@/types/sharedZodTypes';
import {
  createCourseMember,
  findCourseMember,
  updateCourseMember
} from '@/server/utils/courseMemberHelpers';

export const markAllUnmarkedAbsent = async ({
  lectureId
}: {
  lectureId: string;
}) => {
  try {
    const session = await ensureAndGetNextAuthSession();

    const lecture = await prisma.lecture.findFirst({
      where: {
        id: lectureId
      },
      include: {
        attendanceEntries: true,
        course: {
          include: {
            enrollments: true
          }
        }
      }
    });

    if (!lecture) {
      throw new Error('No lecture found!');
    }

    const hasPermission = await bHasCoursePermission({
      courseCode: lecture.course.courseCode,
      role: 'teacher'
    });

    if (!hasPermission || !session) {
      throw new Error('You do not have permission to sync course members');
    }

    const unmarkedEnrollments = lecture.course.enrollments.filter(
      (enrollment) =>
        !lecture.attendanceEntries.some(
          (entry) => entry.courseMemberId === enrollment.id
        )
    );

    await prisma.attendanceEntry.createMany({
      data: unmarkedEnrollments.map((enrollment) => ({
        courseMemberId: enrollment.id,
        lectureId: lecture.id,
        status: 'absent'
      }))
    });
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
