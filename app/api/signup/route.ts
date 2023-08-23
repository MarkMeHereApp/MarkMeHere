import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const formData = await request.formData();

  const firstName = formData.get('firstname') as string;
  const lastName = formData.get('lastname') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Hash and salt the password before inserting it into the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueID = uuidv4();

    // Insert the data into the Prisma database
    const user = await prisma.user.create({
      data: {
        userID: uniqueID,
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}
