import { NextResponse } from 'next/server';
import { QRCode } from '@prisma/client';
import prisma from '@/prisma';

// Creates a new course and returns it
// Generate a random QR code
const generateQRCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export async function POST(request: Request) {
  try {
    // Get the active QR code from the request
    
    const requestData = await request.json();
    
    const activeQRCode = requestData.activeQRCode;

    // If activeQRCode is not present, generate a new one and return
    if (!activeQRCode) {
      const newQRCode = generateQRCode();
      return NextResponse.json({ success: true, qrCode: newQRCode });
    }

    // Delete all QR codes from the database except the active one
    await prisma.qRCode.deleteMany({
      where: {
        code: {
          not: activeQRCode,
        },
      },
    });

    // Generate a new QR code
    const newQRCode = generateQRCode();

    // Return the new QR code
    return NextResponse.json({ success: true, qrCode: newQRCode });
  } catch (error) {
    console.error('Error processing QR code!!:', error);
    return NextResponse.json({
      success: false,
      error: 'Error processing QR code'
    });
  }
}



