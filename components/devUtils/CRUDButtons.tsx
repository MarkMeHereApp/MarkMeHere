import { DeleteAllStudents } from './DeleteAllStudentsButton';
import { GenerateRandomCourseMember } from './GenerateRandomCourseMember';
import { ShowCurrentCourseMembers } from './ShowCurrentCourseMembers';

const CRUDButtons = () => {
  return (
    <>
      <GenerateRandomCourseMember />
      <ShowCurrentCourseMembers />
      <DeleteAllStudents />
    </>
  );
};

export default CRUDButtons;
