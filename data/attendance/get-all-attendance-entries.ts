'use server';

import 'server-only';
import prisma from '@/prisma';
import { generateTypedError } from '@/server/errorTypes';
import { getOrganization } from '../organization/organization';
import { bHasCoursePermission, ensureAndGetNextAuthSession } from '../auth';

export const getAllAttendanceEntries = async ({
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
        professorLectureGeolocation: true,
        course: true
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

    return lecture;
  } catch (error) {
    throw generateTypedError(error as Error);
  }
};
