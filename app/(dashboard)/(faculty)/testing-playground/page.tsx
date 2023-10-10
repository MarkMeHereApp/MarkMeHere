'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RocketIcon } from '@radix-ui/react-icons';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import SamTest from './components/SamTest';
import AldrichTest from './components/AldrichTest';
import ErrorTest from './components/ErrorTest';
import GetCanvasCourses from './components/getCanvasCoursesTest';
import IconsTest from './components/IconsTest';
import CRUDButtons from '@/utils/devUtilsComponents/CRUDButtons';
import GetCourseMembership from './components/GetCourseMembership';

const tabComponents = [
  { value: 'Aldrich Test', component: <AldrichTest /> },
  { value: 'Sams Test', component: <SamTest /> },
  { value: 'Error Test', component: <ErrorTest /> },
  { value: 'GetCanvasCourses', component: <GetCanvasCourses /> },
  { value: 'Icons', component: <IconsTest /> },
  { value: 'GetCourseMembership', component: <GetCourseMembership /> }

  // Add more components here
];

export default function TabsDemo() {
  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex-1 md:w-1/2 p-8 md:p-12">
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Testing Playground</AlertTitle>
          <AlertDescription>
            <p>To add a test component, follow these steps:</p>
            <ol className="list-decimal list-inside">
              <li>
                Add it to <code>/app/dashboard/tests/components</code>
              </li>
              <li>
                Add it to the <code>tabComponents</code> array in{' '}
                <code>/app/dashboard/tests/page.tsx</code>
              </li>
            </ol>
          </AlertDescription>
        </Alert>
        <CRUDButtons />
        <Tabs defaultValue={tabComponents[0].value}>
          <TabsList>
            {tabComponents.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabComponents.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="h-full">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
