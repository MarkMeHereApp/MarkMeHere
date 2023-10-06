import { Course } from '@prisma/client';

interface ManageCoursesDisplayProps {
  courses: Course[];
}

const ManageCoursesDisplay: React.FC<ManageCoursesDisplayProps> = ({
  courses
}) => {
  return (
    <>
      <h1>Manage Courses</h1>

      {courses.map((course) => (
        <div key={course.id}>
          <h2>{course.name}</h2>
        </div>
      ))}
    </>
  );
};

export default ManageCoursesDisplay;
