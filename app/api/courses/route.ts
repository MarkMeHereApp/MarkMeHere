import { NextResponse } from 'next/server';
import { Course } from '@/utils/sharedTypes';
import prisma from '@/prisma';

// Creates a new course and returns it
export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const course = await prisma.course.create({
      data: {
        ...requestData
      }
    });
    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({
      success: false,
      error: 'Error creating course'
    });
  }
}

// Returns all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ name: 'asc' }]
    });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error getting courses:', error);
    return NextResponse.json({
      success: false,
      error: 'Error getting courses'
    });
  }
}

// Deletes a course and returns the remaining courses
export async function DELETE(request: Request) {
  try {
    const requestData = await request.json();
    await prisma.course.delete({
      where: {
        id: requestData.id
      }
    });
    const courses = await prisma.course.findMany({
      orderBy: [{ name: 'asc' }]
    });
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({
      success: false,
      error: 'Error deleting course'
    });
  }
}
