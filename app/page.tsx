import { Card, Title, Text } from '@tremor/react';
import { PrismaClient } from '@prisma/client'
import Search from './search';
import UsersTable from './table';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient()

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {

  const search = searchParams.q ?? '';
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: search,
      }
    }
  })

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Users</Title>
      <Text>
        A list of users retrieved from a MySQL database (PlanetScale).
      </Text>
      <Search />
      <Card className="mt-6">
        {/* @ts-expect-error Server Component */}
        <UsersTable users={users} />
      </Card>
    </main>
  );
}
