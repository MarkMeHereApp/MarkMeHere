import { GlobalDevCourseId } from '@/utils/globalVariables';
import { CourseMember } from '@prisma/client';
interface PersonModule {
  sexType: () => string;
  firstName: (sex: string) => string;
  lastName: (sex: string) => string;
}

interface StringModule {
  uuid: () => string;
}

interface InternetModule {
  email: () => string;
}

interface FakerModule {
  person: PersonModule;
  string: StringModule;
  internet: InternetModule;
}

let faker: FakerModule | undefined;
if (process.env.NODE_ENV === 'development') {
  ({ faker } = require('@faker-js/faker'));
}

export default function createRandomStudent(): CourseMember {
  const sex = faker ? faker.person.sexType() : 'Female';
  const firstName = faker ? faker.person.firstName(sex) : 'John';
  const lastName = faker ? faker.person.lastName(sex) : 'Doe';
  return {
    id: faker ? faker.string.uuid() : 'your-uuid-here',
    lmsId: GlobalDevCourseId,
    email: faker ? faker.internet.email() : 'test@example.com',
    name: firstName + ' ' + lastName,
    dateEnrolled: new Date(),
    role: 'student',
    courseId: GlobalDevCourseId
    // attendanceEntries: []
  };
}
