import { faker } from '@faker-js/faker';

interface User {
  _id: string;
  isStudent: boolean;
  email: string;
  name: string;
  GPA: number;
  age: number;
  gender: string;
  lecturesAttended: number;
  totalLectures: number;
}

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const fullName = `${firstName} ${lastName}`;
  const totalLectures = faker.number.int();

  return {
    _id: faker.string.uuid(),
    isStudent: true,
    email: faker.internet.email(),
    name: fullName,
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
