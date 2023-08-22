import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserType } from '../../../sharedTypes';

import { faker } from '@faker-js/faker';
import prisma from '../../../prisma/index';

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const fullName = `${firstName} ${lastName}`;
  const totalLectures = faker.number.int();

  return {
    userID: faker.string.uuid(),
    userType: faker.helpers.enumValue(UserType),
    email: faker.internet.email(),
    firstName: firstName,
    lastName: lastName,
    name: fullName,
    GPA: faker.number.float({ max: 5.0 }),
    age: faker.number.int({ max: 80 }),
    gender: faker.person.gender(),
    lecturesAttended: faker.number.int({ max: totalLectures }),
    totalLectures: totalLectures,
    password: faker.string.sample({ min: 10, max: 20 })
  } as User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('reached handler');
  if (req.method === 'POST') {
    try {
      const numStudents = faker.number.int({ max: 100 });
      for (let i = 0; i < numStudents; i++) {
        const randomUser = createRandomUser();
        await prisma.user.create({ data: randomUser });
      }

      res.status(200).json({ message: 'Random users added to the database.' });
    } catch (error) {
      console.error('Error adding users:', error);
      res.status(500).json({ error: 'An error occurred while adding users.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' });
  }
}
