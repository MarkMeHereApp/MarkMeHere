import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    // Find the user with the provided email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Email not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: 'Invalid password' });
    }

    // TODO: Generate and send an authentication token to the client
    //const authToken = 'your-auth-token-here';

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({ success: false, error: 'Error during sign-in' });
  }
}
