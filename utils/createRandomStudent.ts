import { Student, Role, GlobalDevCourseId } from '@/utils/sharedTypes';

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

export default function createRandomStudent(): Student {
  const sex = faker ? faker.person.sexType() : 'Female';
  const firstName = faker ? faker.person.firstName(sex) : 'John';
  const lastName = faker ? faker.person.lastName(sex) : 'Doe';
  return {
    id: faker ? faker.string.uuid() : 'your-uuid-here',
    email: faker ? faker.internet.email() : 'test@example.com',
    firstName: firstName,
    lastName: lastName,
    dateCreated: new Date(),
    role: Role.STUDENT,
    courseId: GlobalDevCourseId
    // attendanceEntries: []
  };
}
