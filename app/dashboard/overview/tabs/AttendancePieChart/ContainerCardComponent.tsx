'use client';

import React, { useEffect, useState } from 'react';

import PieChartCardComponent from './PieChartCardComponent';
import ScrollableAreaComponent from './ScrollableAreaComponent';
import { User } from '@/utils/sharedTypes';
import { getFullName } from '@/utils/getFullName';

interface Student extends User {
  fullName: string;
}

const getStudentData = async () => {
  try {
    const response = await fetch('/api/prisma', {
      method: 'GET'
    });

    if (response.ok) {
      const responseData: { users: User[] } = await response.json(); // Use the correct type here
      const users = responseData.users;
      console.log('Users Received', users);
      return users;
    } else {
      console.error('Failed to fetch data:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const AttendanceContainer: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const users = await getStudentData();

      if (users.length > 0) {
        const processedStudents = users.map((student) => ({
          ...student,
          fullName: getFullName(student)
        }));

        setStudents(processedStudents);
        setSelectedStudent(processedStudents[0].fullName);
      } else {
        console.error('No user data received.');
        setStudents([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setStudents([]);
    }
  };

  const handleStudentChange = (studentName: string) => {
    setSelectedStudent(studentName);
  };

  const selectedStudentData = students.find(
    (student) => student.fullName === selectedStudent
  );

  const totalLectures = selectedStudentData?.totalLectures || 0;
  const lecturesAttended = selectedStudentData?.lecturesAttended || 0;

  const attendanceData = [
    {
      name: 'Attended',
      value: (lecturesAttended / totalLectures) * 100
    },
    {
      name: 'Not Attended',
      value: 100 - (lecturesAttended / totalLectures) * 100
    }
  ];

  return (
    <div className="flex flex-row max-h-96 gap-x-8">
      {students.length > 0 && (
        <>
          <ScrollableAreaComponent
            students={students}
            selectedStudent={selectedStudent}
            handleStudentChange={handleStudentChange}
            className="basis-1/3 h-auto"
          />
          <PieChartCardComponent
            selectedStudent={selectedStudent}
            attendanceData={attendanceData}
            className="basis-2/3 h-auto"
          />
        </>
      )}
    </div>
  );
};

export default AttendanceContainer;
