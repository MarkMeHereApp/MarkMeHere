import { User, UserType } from '../../../utils/sharedTypes';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import prisma from '../../../prisma/index';

function createRandomUser(): User {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const totalLectures = faker.number.int({ max: 100_000 });

  return {
    id: faker.string.uuid(),
    userType: faker.helpers.enumValue(UserType),
    email: faker.internet.email(),
    firstName: firstName,
    lastName: lastName,
    GPA: faker.number.float({ max: 5.0 }),
    age: faker.number.int({ max: 80 }),
    gender: faker.person.gender(),
    lecturesAttended: faker.number.int({ max: totalLectures }),
    totalLectures: totalLectures,
    password: faker.string.sample({ min: 10, max: 20 })
  } as User;
}

export async function POST(request: Request) {
  const randomUser = createRandomUser();
  try {
    // Insert the data into the Prisma database
    const user = await prisma.user.create({
      data: randomUser
    });
    const users = await prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }]
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }]
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json({ success: false, error: 'Error getting users' });
  }
}
