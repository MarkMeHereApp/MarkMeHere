import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { UserType } from '../../../utils/sharedTypes';
import { faker } from '@faker-js/faker';
import prisma from '../../../prisma/index';

function createRandomStudent(): Prisma.UserCreateInput {
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
    password: faker.string.sample({ min: 10, max: 20 }),
    dateCreated: new Date(),
    coursesAsStudent: undefined,
    lecturesAttendance: undefined
  };
}

export async function POST(request: Request) {
  const randomUser = createRandomStudent();
  console.log('Random User:', randomUser); // Add this line

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
