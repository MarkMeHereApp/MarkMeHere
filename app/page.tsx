import { Card, Title, Text } from '@tremor/react';
import { PrismaClient } from '@prisma/client';
import Search from './search';
import UsersTable from './table';

const prisma = new PrismaClient();

export default async function IndexPage() {
  // const search = searchParams.q ?? '';
  // const users = await prisma.user.findMany({
  //   where: {
  //     name: {
  //       contains: search,
  //     }
  //   }
  // })

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="mt-10">Home Page</Title>
      {/* <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6"> */}

      {/* <UsersTable users={users} />
      </Card> */}
    </main>
  );
}
