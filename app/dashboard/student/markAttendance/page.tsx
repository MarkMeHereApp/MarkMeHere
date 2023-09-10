import { cookies } from 'next/headers'

export default function markAttendance() {
  const cookieStore = cookies()

  const courseId  = cookieStore.get('courseId')
  const attendancetoken = cookieStore.get('attendanceToken')
  console.log(cookieStore)
  console.log('courseId: ' + courseId)
  console.log('token: ' + attendancetoken)

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
       
      </div>
    </>
  );
}
