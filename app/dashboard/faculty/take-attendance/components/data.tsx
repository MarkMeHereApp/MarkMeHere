import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ClockIcon
} from '@radix-ui/react-icons';

export const statuses = [
  {
    value: 'present',
    label: 'Present',
    icon: CheckCircledIcon
  },
  {
    value: 'absent',
    label: 'Absent',
    icon: CrossCircledIcon
  },
  {
    value: 'excused',
    label: 'Excused',
    icon: CircleIcon
  },
  {
    value: 'late',
    label: 'Late',
    icon: ClockIcon
  }
];
