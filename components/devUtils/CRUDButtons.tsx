import { DeleteAllStudents } from './DeleteAllStudentsButton';
import { GenerateRandomCourseMember } from './GenerateRandomCourseMember';
import { GetCanvasCourses } from './GetCanvasCourses';
import { ShowCurrentCourseMembers } from './ShowCurrentCourseMembers';

const CRUDButtons = () => {
  return (
    <>
      <GenerateRandomCourseMember />
      <ShowCurrentCourseMembers />
      <DeleteAllStudents />
      <GetCanvasCourses />
    </>
  );
};

export default CRUDButtons;
