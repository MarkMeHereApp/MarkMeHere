'use client';

import * as React from 'react';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import {
    ClockIcon,
    CheckCircledIcon,
    CrossCircledIcon,
    CircleIcon
  } from '@radix-ui/react-icons';
import { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

interface AttendanceStatusesProps {
  attendanceData: any[];
}

const AttendanceStatuses: React.FC<AttendanceStatusesProps> = ({
    attendanceData
}) => {
  return (
    <Card>
        <CardContent className='p-2 flex flex-row items-center justify-center w-full'> 
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-x-14'>
                <div className='p-2 flex flex-col text-center font-bold '>
                    <div className='flex flex-row items-center'>
                        <CheckCircledIcon className="mr-2 h-16 w-16" />
                        <div className='flex flex-col text-start'>
                            <span className='text-4xl text-primary'>{String(attendanceData[0].value) + '%'}</span>
                            <span className='text-xl'>HERE</span>
                        </div>
                    </div>
                </div>
                <div className='p-2 flex flex-col text-center font-bold '>
                    <div className='flex flex-row items-center'>
                        <CircleIcon className="mr-2 h-16 w-16" />
                        <div className='flex flex-col text-start'>
                            <span className='text-4xl text-primary'>{String(attendanceData[1].value) + '%'}</span>
                            <span className='text-xl'>EXCUSED</span>
                        </div>
                    </div>
                </div>
                <div className='p-2 flex flex-col text-center font-bold '>
                    <div className='flex flex-row items-center'>
                        <ClockIcon className="mr-2 h-16 w-16" />
                        <div className='flex flex-col text-start'>
                            <span className='text-4xl text-primary'>{String(attendanceData[2].value) + '%'}</span>
                            <span className='text-xl'>LATE</span>
                        </div>
                    </div>
                </div>
                <div className='p-2 flex flex-col text-center font-bold '>
                    <div className='flex flex-row items-center'>
                        <CrossCircledIcon className="mr-2 h-16 w-16" />
                        <div className='flex flex-col text-start'>
                            <span className='text-4xl text-destructive'>{String(attendanceData[3].value) + '%'}</span>
                            <span className='text-xl'>ABSENT</span>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
    
  );
};

export default AttendanceStatuses;

// <Card>
// <CardContent className='p-3'> 
//     <div className='grid grid-cols-2 md:grid-cols-4'>
//     <Card className='m-2 h-35 p-4 bg-primary max-w-md'>
//     <CardContent className='flex flex-row items-center justify-center p-3 h-full text-primary-foreground'> 
//         <CheckCircledIcon className="h-10 w-10"/>
//         <div className='ml-4 flex flex-col text-center font-bold'>
//             <span>{String(attendanceData[0].value) + '%'}</span>
//             <span>HERE</span>
//         </div>
//     </CardContent>
// </Card>
// <Card className='m-2 h-35 p-4 bg-primary max-w-md'>
//     <CardContent className='flex flex-row items-center justify-center p-3 h-full text-primary-foreground'> 
//         <ClockIcon className="h-10 w-10" />
//         <div className='ml-4 flex flex-col text-center font-bold'>
//             <span>{String(attendanceData[2].value) + '%'}</span>
//             <span>LATE</span>
//         </div>
//     </CardContent>
// </Card>
// <Card className='m-2 h-35 p-4 bg-primary max-w-md'> 
//     <CardContent className='flex flex-row items-center justify-center p-3 h-full text-primary-foreground'> 
//         <CircleIcon className="h-10 w-10"/>
//         <div className='ml-4 flex flex-col text-center font-bold'>
//             <span>{String(attendanceData[1].value) + '%'}</span>
//             <span>EXCUSED</span>
//         </div>
//     </CardContent>
// </Card>
// <Card className='m-2 h-35 p-4 bg-destructive max-w-md'>
//     <CardContent className='flex flex-row items-center justify-center p-3 h-full text-destructive-foreground'> 
//         <CrossCircledIcon className="h-10 w-10" />
//         <div className='ml-4 flex flex-col text-center font-bold'>
//             <span>{String(attendanceData[3].value) + '%'}</span>
//             <span>ABSENT</span>
//         </div>
//     </CardContent>
// </Card>
//     </div>
// </CardContent>
// </Card>
// possible code 
{/* 
    const data02 = [
        { name: 'A1', value: 100 },
        { name: 'A2', value: 300 },
      ];
    <ResponsiveContainer width="100%" height={150}>
        <PieChart width={75} height={75}>
            <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={65} fill="#8884d8" />
        </PieChart>
    </ResponsiveContainer>
    <ResponsiveContainer width="100%" height={150}>
        <PieChart width={75} height={75}>
            <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={65} fill="#8884d8" />
        </PieChart>
    </ResponsiveContainer>
    <ResponsiveContainer width="100%" height={150}>
        <PieChart width={75} height={75}>
            <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={65} fill="#8884d8" />
        </PieChart>
    </ResponsiveContainer>
    <ResponsiveContainer width="100%" height={150}>
        <PieChart width={75} height={10750}>
            <Pie data={data02} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={65} fill="#8884d8" />
        </PieChart>
    </ResponsiveContainer> 
*/}