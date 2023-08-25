import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { UserType } from '@/utils/sharedTypes';
import { faker } from '@faker-js/faker';
import prisma from '@/prisma';

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
    dateCreated: new Date()
  };
}

export async function POST(request: Request) {
  const randomStudent = createRandomStudent();
  console.log('Random Student:', randomStudent); // Add this line

  try {
    // Insert the data into the Prisma database
    const user = await prisma.user.create({
      data: randomStudent
    });
    const students = await prisma.user.findMany({
      orderBy: [{ lastName: 'asc' }]
    });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}

export async function GET(request: Request) {
  try {
    const students = await prisma.user.findMany({
      where: {
        userType: {
          equals: UserType.STUDENT
        }
      },
      orderBy: [{ lastName: 'asc' }]
    });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error getting users:', error);
    return NextResponse.json({ success: false, error: 'Error getting users' });
  }
}

export async function DELETE(request: Request) {
  try {
    // Delete all students
    await prisma.user.deleteMany({
      where: {
        userType: {
          equals: UserType.STUDENT
        }
      }
    });
    const students = await prisma.user.findMany({
      where: {
        userType: {
          equals: UserType.STUDENT
        }
      },
      orderBy: [{ lastName: 'asc' }]
    });
    return NextResponse.json({ success: true, students });
  } catch (error) {
    console.error('Error deleting students:', error);
    return NextResponse.json({
      success: false,
      error: 'Error deleting students'
    });
  }
}
