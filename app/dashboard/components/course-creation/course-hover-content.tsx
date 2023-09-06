import React from 'react';
import { HoverCardContent } from '@/components/ui/hover-card';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  zCreateCourseErrorDescriptions,
  zLMSCourseScheme,
  zLMSCourseSchemeType
} from '@/types/sharedZodTypes';

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
          <p className="text-xs">
            <i>
              {course.course_code ? (
                <>
                  <b>Course Code:</b> {course.course_code}
                </>
              ) : (
                'No Course Code'
              )}
            </i>
          </p>
          <p className="text-xs">
            <i>
              <b>Course ID: </b>
              {course.lmsId}
            </i>
          </p>
          <p className="text-xs">
            <i>
              <b>
                {course.enrollments.length > 1
                  ? 'Course Roles: '
                  : 'Course Role: '}
              </b>
              {course.enrollments.map((enrollment, index, array) => (
                <span key={index}>
                  {enrollment.role.split(/(?=[A-Z])/).join(' ')}
                  {index < array.length - 1 ? ', ' : ''}
                </span>
              ))}
            </i>
          </p>
          <p className="text-sm">
            {course.ableToCreateCourse ? (
              <span className="flex items-start flex-wrap">
                <CheckCircledIcon className="mr-2 mt-1 text-primary" />
                {' This course is available to import.'}
              </span>
            ) : (
              <span className="flex items-start flex-wrap">
                <CrossCircledIcon className="mr-2 mt-1 text-destructive" />
                <span style={{ maxWidth: '90%' }}>
                  {course.createCourseError
                    ? zCreateCourseErrorDescriptions[course.createCourseError]
                    : 'Unexpected Erorr'}
                </span>
              </span>
            )}
          </p>

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
