import { publicProcedure, router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';

export const zGeolocationVerification = z.object({
  studentLatitude: z.number(),
  studentLongtitude: z.number(),
  id: z.string()
});

export const attendanceTokenRouter = router({
  ValidateGeolocation: publicProcedure
    .input(zGeolocationVerification)
    .mutation(async ({ input }) => {

      try {
        const lectureResult = await prisma.attendanceToken.findUnique({
          where: {
            id: input.id
          }
        });


        if (lectureResult === null) {
          return { success: false };
        }

        const geolocationId = lectureResult.ProfessorLectureGeolocationId;

        if (!geolocationId) {
          throw new Error('Geolocation ID not found!');
        }

        const geolocationLectureResult =
          await prisma.professorLectureGeolocation.findMany({
            where: {
              id: geolocationId
            }
          });

        if (!geolocationLectureResult) {
          throw new Error('Geolocation not found!');
        }
        
        const lectureRange = geolocationLectureResult[0].lectureRange
        const lectureLatitude = geolocationLectureResult[0].lectureLatitude;
        const lectureLongitude = geolocationLectureResult[0].lectureLongitude;

        const distanceBetween2Points = (
          profLat: number,
          profLong: number,
          studLat: number,
          studLong: number
        ) => {
          if (profLat == studLat && profLong == studLong) {
            return 0;
          } else {
            const radlat1 = (Math.PI * profLat) / 180;
            const radlat2 = (Math.PI * studLat) / 180;
            const theta = profLong - studLong;
            const radtheta = (Math.PI * theta) / 180;
            let dist =
              Math.sin(radlat1) * Math.sin(radlat2) +
              Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
              dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 6076.11549; //nothing: nautical miles,  miles: * 1.1515, km: * 1.852, meters: * 1852, feet: * 6,076.11549
            return dist;
          }
        };

        const calculateDistance = distanceBetween2Points(
          lectureLatitude,
          lectureLongitude,
          input.studentLatitude,
          input.studentLongtitude
        );

        const attendanceTokenLocation = await prisma.attendanceToken.update({
          where: {
            id: input.id
          },
          data: {
            attendanceStudentLatitude: input.studentLatitude,
            attendanceStudentLongtitude: input.studentLongtitude,
            ProfessorLectureGeolocationId: geolocationId
          }
        });

        return {
          success: true,
          id: input.id,
          distance: calculateDistance,
          geolocationInfo: geolocationLectureResult,
          lectureLatitude: lectureLatitude,
          lectureLongtitude: lectureLongitude,
          lectureRange: lectureRange
        };
      } catch (error) {
        throw error;
      }
    })

  // FindGeolocationLectureProfessor: publicProcedure
  // .input(lectureId)
});
