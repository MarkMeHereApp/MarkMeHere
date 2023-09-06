import { promises as fs } from 'fs';
import path from 'path';
import { Metadata } from 'next';
import { z } from 'zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { StartScanningButton } from './components/user-nav';
import { taskSchema } from './data/schema';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.'
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(
      process.cwd(),
      'app/(instructor)/dashboard/take-attendance/data/tasks.json'
    )
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Attendance Management
          </h2>
          <div className="flex items-center space-x-2">
            <StartScanningButton />
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
