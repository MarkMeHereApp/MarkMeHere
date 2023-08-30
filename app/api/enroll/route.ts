import { NextResponse } from 'next/server';
import prisma from '@/prisma';

// Creates a new course member and returns it
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const courseMember = await prisma.courseMember.create({
      data: {
        ...requestData
      }
    });
    return NextResponse.json({ success: true, courseMember });
  } catch (error) {
    console.error('Error creating course member:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating course member'
    });
  }
}
