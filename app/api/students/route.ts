import { NextResponse } from 'next/server';
import { UserType } from '@/utils/sharedTypes';
import bcrypt from 'bcryptjs-react';
import { faker } from '@faker-js/faker';
import prisma from '@/prisma';

// Returns an array of the students with the new student added
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const fakePassword:string = faker.string.sample()
    const student = await prisma.user.create({
      data: {
        ...requestData,
        password: fakePassword,
        dateCreated: new Date(Date.now())
      }
    });
    if (student) {
      const students = await prisma.user.findMany({
        where: {
          userType: {
            equals: UserType.STUDENT
          }
        },
        orderBy: [{ lastName: 'asc' }]
      });
      return NextResponse.json({ success: true, students });
    }
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}

// Returns all students
export async function GET() {
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

// Deletes all students and returns an empty array.
// Need to add further functionality so that we can either delete a single student or all students.
export async function DELETE() {
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
