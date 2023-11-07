import { PrismaClient } from '@prisma/client';
import { demoAccounts } from '@/utils/globalVariables';
const prisma = new PrismaClient();

/*
This seeds the Demo Site with demo data. It shouldn't do anything if we have demo mode disabled.
*/
async function main() {
  if (!(process.env.NEXT_PUBLIC_DEMO_MODE?.toString() === 'true')) {
    return;
  }

  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.organization.create({
    data: {
      name: 'Demo Organization',
      uniqueCode: 'demo',
      hashEmails: false
    }
  });

  for (const account of demoAccounts) {
    await prisma.user.upsert({
      where: { email: `${account.name}@demo.com` },
      update: {},
      create: {
        email: `${account.name}@demo.com`,
        name: account.name,
        role: account.role
      }
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
