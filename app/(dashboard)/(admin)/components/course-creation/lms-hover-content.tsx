import { HoverCardContent } from '@/components/ui/hover-card';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  zCreateCourseErrorDescriptions,
  zLMSCourseSchemeType
} from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';

const CourseHoverCardContent = ({
  course
}: {
  course: zLMSCourseSchemeType;
}) => {
  return (
    <HoverCardContent className="w-80" side="right">
      <div className="flex justify-between space-x-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">
            {course.name || 'No Course Name'}
          </h4>
          {
            // Course Codde (we currently call it label in the db).
          }
          <p className="text-xs">
            <i>
              <b>Course Code:</b>{' '}
              {course.course_code ? course.course_code : 'No Course Code'}
            </i>
          </p>
          {
            // LMS ID
          }
          <p className="text-xs">
            <i>
              <b>{formatString(course.lmsType) + ' ID: '}</b>
              {course.lmsId}
            </i>
          </p>

          {
            // Roles
          }
          <p className="text-xs">
            <i>
              <b>
                {formatString(course.lmsType) +
                  ' Role' +
                  (course.enrollments.length > 1 ? 's' : '') +
                  ': '}
              </b>
              {course.enrollments.map((enrollment, index, array) => (
                <span key={index}>
                  {formatString(enrollment.role)}
                  {index < array.length - 1 ? ', ' : ''}
                </span>
              ))}
            </i>
          </p>
          {
            // Number of Students
          }
          <p className="text-xs">
            <i>
              <b>Number of Students: </b>
              {course.totalStudents || 'Not Available'}
            </i>
          </p>
          {
            // Able to create course
          }
          <p className="text-sm">
            <span className="flex items-start flex-wrap">
              {course.ableToCreateCourse ? (
                <CheckCircledIcon className="mr-2 mt-1 text-primary" />
              ) : (
                <CrossCircledIcon className="mr-2 mt-1 text-destructive" />
              )}
              <span style={{ maxWidth: '90%' }}>
                {course.createCourseErrorStatus
                  ? zCreateCourseErrorDescriptions[
                      course.createCourseErrorStatus
                    ]
                  : 'Unexpected Error'}
              </span>
            </span>
          </p>

          {
            // Course Dates
          }
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
            <span className="text-xs text-muted-foreground">
              {course.start_at && course.end_at
                ? `${new Date(
                    course.start_at
                  ).toLocaleDateString()} - ${new Date(
                    course.end_at
                  ).toLocaleDateString()}`
                : course.start_at
                ? `Starts at ${new Date(course.start_at).toLocaleDateString()}`
                : course.end_at
                ? `Ends at ${new Date(course.end_at).toLocaleDateString()}`
                : 'Course dates not available'}
            </span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  );
};

export default CourseHoverCardContent;
