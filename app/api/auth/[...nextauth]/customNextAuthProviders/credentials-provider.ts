import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { zSiteRoles } from '@/types/sharedZodTypes';
import { formatString } from '@/utils/globalFunctions';
import { demoAccounts } from '@/utils/globalVariables';

export default CredentialsProvider({
  name: 'Credentials',
  credentials: {
    username: { label: 'Username', type: 'text', optional: true },
    password: { label: 'Password', type: 'password', optional: true },
    tempAdminKey: { label: 'Key', type: 'text', optional: true },
    demoLogin: { label: 'Demo Login', type: 'boolean', optional: true }
  },
  async authorize(credentials) {
    const username: string = credentials?.username ?? '';
    const password: string = credentials?.password ?? '';
    const tempAdminKey: string = credentials?.tempAdminKey ?? '';
    const demoLogin: boolean = Boolean(credentials?.demoLogin) ?? false;

    // Handle temporary admin login (first time setup logins)
    if (
      tempAdminKey === process.env.FIRST_TIME_SETUP_ADMIN_PASSWORD?.toString()
    ) {
      const user: User = {
        id: 'TemporaryAdminId', // Provide a unique id
        email: 'temporary@admin.com',
        name: 'Temporary Admin',
        image: '',
        role: zSiteRoles.Enum.admin,
        optionalId: 'TempOptionalId',
        dateCreated: new Date(), // Provide the current date
        selectedCourseId: null // Set to null or provide a valid courseId
      };
      return user;
    }

    // Handle demo logins
    if (demoLogin && process.env.DEMO_MODE?.toString() === 'true') {
      const demoAccount = demoAccounts.find(
        (account) => account.name === username
      );

      if (username === password && demoAccount) {
        const demoName = formatString(demoAccount.name);
        const demoEmail = `${demoAccount.name}@demo.com`;
        const demoRole = demoAccount.role;

        // @TODO we need to assign the correct role here
        const user: User = {
          id: username, // Provide a unique id
          email: demoEmail,
          name: demoName,
          image: '',
          role: zSiteRoles.Enum.admin,
          optionalId: demoAccount.name,
          dateCreated: new Date(), // Provide the current date
          selectedCourseId: null // Set to null or provide a valid courseId
        };
        return user;
      }
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
