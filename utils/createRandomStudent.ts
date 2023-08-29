import { Student, UserType } from '@/utils/sharedTypes';

interface FakerModule {
  person: {
    sexType: () => string;
    firstName: (sex: string) => string;
    lastName: (sex: string) => string;
  };
  string: {
    uuid: () => string;
  };
  internet: {
    email: () => string;
  };
}

let faker: FakerModule | undefined;
if (process.env.NODE_ENV === 'development') {
  faker = require('@faker-js/faker');
}

export default function createRandomStudent(): Student {
  const sex = faker ? faker.person.sexType() : 'Female';
  const firstName = faker ? faker.person.firstName(sex) : 'John';
  const lastName = faker ? faker.person.lastName(sex) : 'Doe';

  return {
    id: faker ? faker.string.uuid() : 'your-uuid-here',
    userType: UserType.STUDENT,
    email: faker ? faker.internet.email() : 'test@example.com',
    firstName: firstName,
    lastName: lastName,
    fullName: `${firstName} ${lastName}`,
    dateCreated: new Date(),
    password: ''
  };
}
