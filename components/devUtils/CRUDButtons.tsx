import { GenerateRandomCourseMember } from './GenerateRandomCourseMember';
import { ShowCurrentCourseMembers } from './ShowCurrentCourseMembers';

const CRUDButtons = () => {
  return (
    <>
      <GenerateRandomCourseMember />
      <ShowCurrentCourseMembers />
    </>
  );
};

export default CRUDButtons;
