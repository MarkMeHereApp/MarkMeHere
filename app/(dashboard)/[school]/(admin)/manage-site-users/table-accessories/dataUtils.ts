import {
  PiStudent,
  PiChalkboardTeacher,
  PiUserCircleGear,
  PiUserSquareDuotone
} from 'react-icons/pi';

export const roles = [
  {
    value: 'student',
    label: 'Student',
    icon: PiStudent
  },
  {
    value: 'professor',
    label: 'Professor',
    icon: PiChalkboardTeacher
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: PiUserCircleGear
  },
  {
    value: 'moderator',
    label: 'Moderator',
    icon: PiUserSquareDuotone
  }
];
