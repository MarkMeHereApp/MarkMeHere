import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export default CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'text', optional: true },
    password: { label: 'Password', type: 'password', optional: true },
    key: { label: 'Key', type: 'text', optional: true }
  },
  async authorize(credentials) {
    const email: string = credentials?.email ?? '';
    const password: string = credentials?.password ?? '';
    const key: string = credentials?.key ?? '';

    if (key === process.env.TEMP_ADMIN_SECRET?.toString()) {
      const user: User = {
        id: 'TempAdminId', // Provide a unique id
        email: 'TempAdmin',
        name: 'Temporary Admin',
        image: '',
        role: 'FACULTY',
        optionalId: 'TempOptionalId',
        dateCreated: new Date(), // Provide the current date
        selectedCourseId: null // Set to null or provide a valid courseId
      };
      return user;
    }

    return null;
    /*
    const user = await prisma.user.findUnique({
      where: { email },
      select: { password: true }
    });

    if (!user) {
      throw new Error('Cannot find user associated with this email');
    }

    const isPasswordValid =
      user.password && (await bcrypt.compare(password, user.password));

    if (isPasswordValid) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      return null;
    }
    */
  }
});
