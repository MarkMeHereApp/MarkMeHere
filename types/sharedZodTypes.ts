import z from 'zod';

export const zLMSProvider = z.enum(['canvas', 'moodle']);
export type zLMSProviderType = z.infer<typeof zLMSProvider>;

export const zCreateCourseErrorStatus = z.enum([
  'available',
  'duplicate',
  'noEmailAccess',
  'noEnrollmentAccess'
]);

export const zCreateCourseErrorDescriptions: Record<
  z.infer<typeof zCreateCourseErrorStatus>,
  string
> = {
  available: 'The course is available to be created.',
  duplicate: 'The course already exists in the database.',
  noEmailAccess:
    'Access to view the emails of course members for this course is currently restricted. This app requires access to course member emails.',
  noEnrollmentAccess:
    'Access to view the enrollments of course members for this course is currently unnavailable. This app requires access to course member enrollments.'
};

/**
 * zLMSCourseScheme is a Zod schema for validating LMS course data. All LMS Providers should use this schema.
 *
 * @var {string} lmsId - The unique identifier for the LMS course.
 *
 * @var {zLMSProvider} lmsType - The type of LMS provider. It can be either 'canvas' or 'moodle'.
 *
 * @var {string|null} name - The name of the course. It can be null.
 *
 * @var {string|null} course_code - The code of the course. It can be null.
 *
 * @var {string|null} start_at - The start date of the course. It can be null.
 *
 * @var {string|null} end_at - The end date of the course. It can be null.
 *
 * @var {Array<{role: string}>} enrollments - The list of enrollments in the course. Each enrollment has a role.
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
  ableToCreateCourse: z.boolean().default(true),
  createCourseErrorStatus: zCreateCourseErrorStatus.default('available')
});
export type zLMSCourseSchemeType = z.infer<typeof zLMSCourseScheme>;
