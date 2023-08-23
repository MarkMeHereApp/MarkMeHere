import { User, UserType } from '@/utils/sharedTypes';

import { faker } from '@faker-js/faker';

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const totalLectures = faker.number.int();

  return {
    userID: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.string.symbol({ min: 10, max: 100 }),
    userType: faker.helpers.enumValue(UserType),
    firstName,
    lastName,
    GPA: faker.number.float({ max: 5.0 }),
    age: faker.number.int({ max: 80 }),
    gender: faker.person.gender(),
    lecturesAttended: faker.number.int({ max: totalLectures }),
    totalLectures: totalLectures
  };
}

const numStudents = faker.number.int({ max: 1000 });
const sampleStudentData: User[] = [];
for (let i = 0; i < numStudents; i++) {
  sampleStudentData.push(createRandomUser());
}
export default sampleStudentData;
