import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';

export const utilsRouter = router({
  deleteDatabase: publicProcedure.mutation(async () => {
    // Delete data from tables with foreign key relationships first
    await prisma.$executeRaw`DELETE FROM "AttendanceEntry"`;
    await prisma.$executeRaw`DELETE FROM "CourseMember"`;
    await prisma.$executeRaw`DELETE FROM "qrcode"`;
    await prisma.$executeRaw`DELETE FROM "Lecture"`;

    // Now you can delete data from other tables
    await prisma.$executeRaw`DELETE FROM "User"`;
    await prisma.$executeRaw`DELETE FROM "Account"`;
    await prisma.$executeRaw`DELETE FROM "VerificationToken"`;
    await prisma.$executeRaw`DELETE FROM "Course"`;

    return; // Return void when the database is deleted
  })
});
