import { User } from './sharedTypes';

export const getFullName = (user: User) => {
  return `${user.firstName} ${user.lastName}`;
};
