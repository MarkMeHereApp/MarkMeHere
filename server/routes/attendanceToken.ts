import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

export const zActiveCode = z.object({
  code: z.string()
})


export const zGeolocationVerification = z.object({
  studentLatitude: z.number(),
  studentLongtitude: z.number(),
  id: z.string()
})

export const attendanceTokenRouter = router({

    ValidateAndCreateAttendanceToken: publicProcedure
    .input(zActiveCode)
    .mutation(async ({ input }) => {
      try {
        const qrResult = await prisma.qrcode.findUnique({
          where: {
            code: input.code
          }
        });

        if (qrResult === null) {
          return { success: false };
        }

        console.log(qrResult.ProfessorLectureGeolocationId)

        const { id } = await prisma.attendanceToken.create({
          data: {
            token:  uuidv4(),
            lectureId: qrResult.lectureId,
            ProfessorLectureGeolocationId: qrResult.ProfessorLectureGeolocationId
          }
        });

        return { success: true, token: id, location: qrResult.ProfessorLectureGeolocationId };
      } catch (error) {
        throw error;
      }
    }),


    ValidateGeolocation: publicProcedure
    .input(zGeolocationVerification)
    .mutation(async ({ input }) => {
      
      console.log(input)

      try {
        const lectureResult = await prisma.attendanceToken.findUnique({
          where:{
            id:input.id
          }
        })

        console.log('this is the lecture result fetch: ' + lectureResult?.ProfessorLectureGeolocationId)

        if (lectureResult === null) {
          return { success: false };
        }

        const geolocationId = lectureResult.ProfessorLectureGeolocationId
        console.log(geolocationId)

        if(!geolocationId){
          throw new Error ('Geolocation ID not found!')
        }
       
        const geolocationLectureResult = await prisma.professorLectureGeolocation.findMany({
          where:{
            id: geolocationId
          }
        });

        if(!geolocationLectureResult){
          throw new Error('Geolocation not found!')
        }

        console.log(geolocationLectureResult[0])

        const lectureLatitude = geolocationLectureResult[0].lectureLatitude
        const lectureLongitude = geolocationLectureResult[0].lectureLongitude

        console.log('lecture latitude: '+ lectureLatitude + 'lecture longtitude: ' + lectureLongitude)
        

        const distanceBetween2Points = (profLat: number, profLong: number, studLat: number, studLong: number) => {
          if ((profLat == studLat) && (profLong == studLong)) {
            return 0;
          } else {
            const radlat1 = Math.PI * profLat / 180;
            const radlat2 = Math.PI * studLat / 180;
            const theta = profLong - studLong;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
              dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            return dist;
          }
        };

        const calculateDistance = distanceBetween2Points(lectureLatitude,lectureLongitude,input.studentLatitude,input.studentLongtitude)
        
        if(geolocationLectureResult && input){
          console.log('distance difference in miles:' + calculateDistance);
        }

        const attendanceTokenLocation = await prisma.attendanceToken.update({
          where:{
            id: input.id
          },
          data:{
            attendanceStudentLatitude: input.studentLatitude,
            attendanceStudentLongtitude: input.studentLongtitude,
            ProfessorLectureGeolocationId: geolocationId
          }
        })

       

        return { success: true, id: input.id, distance: calculateDistance, geolocationInfo: geolocationLectureResult };
      } catch (error) {
        throw error;
      }
    }),

    // FindGeolocationLectureProfessor: publicProcedure
    // .input(lectureId)
})


