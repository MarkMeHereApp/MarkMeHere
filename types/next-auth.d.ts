//Override the user type nextauth uses

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
    dateCreated?: Date | null;
    selectedCourseId?: string | null;
  }
}
