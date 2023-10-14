import z from 'zod';
import { CourseMember, AttendanceEntry } from '@prisma/client';
import {
  CircleIcon,
  ClockIcon,
  CrossCircledIcon,
  CheckCircledIcon
} from '@radix-ui/react-icons';

import { Icons } from '@/components/ui/icons';

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// LMS TYPES

// Currently supported LMS Providers: Canvas
// None is used if there is no LMS Provider.
export const zLMSProvider = z.enum(['none', 'canvas']);
export type zLMSProviderType = z.infer<typeof zLMSProvider>;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// ROLE TYPES

// Admin: Can do anything
// Moderator: Can create classes and are always enrolled in those classes. They can also delete their classes.
// User: Can only view classes they are enrolled in.
export const zSiteRoles = z.enum(['admin', 'moderator', 'user']);
export type zSiteRolesType = z.infer<typeof zSiteRoles>;

// Teacher: Can Add/Remove students from their course
// TA: Can Take Attendance
// Student: Can view their attendance data
export const zCourseRoles = z.enum(['teacher', 'ta', 'student']);
export type zCourseRolesType = z.infer<typeof zCourseRoles>;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// ATTENDANCE TYPES

export type ExtendedCourseMember = CourseMember & {
  AttendanceEntry?: AttendanceEntry;
};

export const zAttendanceStatus = z.enum(['here', 'excused', 'late', 'absent']);
export type zAttendanceStatusType = z.infer<typeof zAttendanceStatus>;

export const zAttendanceStatusIcons: Record<
  zAttendanceStatusType,
  React.ComponentType
> = {
  here: () => <Icons.logo className="text-primary wave w-5 h-5" />,
  late: () => <ClockIcon className="mr-1" />,
  excused: () => <CircleIcon className="mr-1" />,
  absent: () => <CrossCircledIcon className="mr-1 text-destructive" />
};

export const zAttendanceStatusIconsNotFun: Record<
  zAttendanceStatusType,
  (props: { className?: string }) => JSX.Element
> = {
  here: ({ className }) => <CheckCircledIcon className={className} />,
  late: ({ className }) => <ClockIcon className={className} />,
  excused: ({ className }) => <CircleIcon className={className} />,
  absent: ({ className }) => <CrossCircledIcon className={className} />
};

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// CREATE COURSE ERROR TYPES

export const zCreateCourseErrorStatus = z.enum([
  'available',
  'alreadyEnrolled',
  'duplicate',
  'noEmailAccess',
  'noEnrollmentAccess'
]);

export const zCreateCourseErrorDescriptions: Record<
  z.infer<typeof zCreateCourseErrorStatus>,
  string
> = {
  available: 'The course is available to be created.',
  alreadyEnrolled:
    'You are already enrolled in a course linked to this LMS course.',
  duplicate:
    'The course already exists in the database. A professor of the course, or a site administrator can add you to the course.',
  noEmailAccess:
    'Access to view the emails of course members for this course is currently restricted. This app requires access to course member emails.',
  noEnrollmentAccess:
    'Access to view the enrollments of course members for this course is currently unnavailable. This app requires access to course member enrollments.'
};

/**
 * zLMSCourseScheme is a Zod schema for validating LMS course data. All LMS Providers should use this schema.
 *
 * @var {boolean} ableToCreateCourse - A flag indicating whether the course can be created. It defaults to true.
 *                                   - This can be caused by the course already existing in the database,
 *                                   - or if the lms api key doesn't have access to course data like enrollment emails.
 *
 * @var {string|null} createCourseError - The error message if the course cannot be created. It can be null. This links with zErrorDescriptions
 */
export const zLMSCourseScheme = z.object({
  lmsId: z.string(),
  lmsType: zLMSProvider,
  name: z.string().nullable().optional(),
  course_code: z.string().nullable().optional(),
  start_at: z.string().nullable().optional(),
  end_at: z.string().nullable().optional(),
  enrollments: z.array(z.object({ role: z.string() })).default([]),
  totalStudents: z.number().nullable().optional(),
  ableToCreateCourse: z.boolean().default(true),
  createCourseErrorStatus: zCreateCourseErrorStatus.default('available')
});
export type zLMSCourseSchemeType = z.infer<typeof zLMSCourseScheme>;

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// TOAST TYPES

export const zIconPresets = z.enum([
  'success',
  'warning',
  'error_for_destructive_toasts',
  'error_for_nondestructive_toasts',
  'bookmark'
]);
export type zIconPresetsType = z.infer<typeof zIconPresets>;
