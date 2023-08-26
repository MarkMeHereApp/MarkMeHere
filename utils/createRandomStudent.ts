import { Student, UserType } from '@/utils/sharedTypes';

import { faker } from '@faker-js/faker';

export default function createRandomStudent(): Student {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);

  return {
    id: faker.string.uuid(),
    userType: UserType.STUDENT,
    email: faker.internet.email(),
    firstName: firstName,
    lastName: lastName,
    fullName: `${firstName} ${lastName}`,
    dateCreated: new Date(),
    password: ''
  };
}
