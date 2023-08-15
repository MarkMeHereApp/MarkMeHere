import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();

  const firstname = formData.get('firstname') as string;
  const lastname = formData.get('lastname') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Hash the password before inserting it into the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the data into the Prisma database
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword
      }
    });

    console.log('User inserted:', user);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error inserting user:', error);

    return NextResponse.json({ success: false, error: 'Error inserting user' });
  }
}
