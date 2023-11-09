import { router } from '../trpc';
import prisma from '@/prisma';
import { z } from 'zod';
import elevatedCourseMemberLectureProcedure from '../middleware/elevatedCourseMemberLectureProcedure';

export const zCreateProfessorLectureGeolocation = z.object({
  lectureLatitude: z.number(),
  lectureLongitude: z.number(),
  lectureId: z.string(),
  courseMemberId: z.string()
});

export const zGetRangeProfessorStudent = z.object({
  ProfessorGeolocationId: z.string(),
  studentLatitude: z.number(),
  studentLongtitude: z.number(),
  lectureId: z.string()
});

export const geolocationRouter = router({
  CreateProfessorLectureGeolocation: elevatedCourseMemberLectureProcedure
    .input(zCreateProfessorLectureGeolocation)
    .mutation(async (requestData) => {
      console.log('got here');
      try {
        const resGeolocation = await prisma.professorLectureGeolocation.create({
          data: {
            ...requestData.input
          }
        });

        return { success: true, id: resGeolocation.id };
      } catch (error) {
        throw error;
      }
    }),

  CalculateRangeProfessorStudent: elevatedCourseMemberLectureProcedure
    .input(zGetRangeProfessorStudent)
    .mutation(async (requestData) => {
      console.log('got here 1');
      try {
        const professorGeolocatinCoordinates =
          await prisma.professorLectureGeolocation.findUnique({
            where: {
              id: requestData.input.ProfessorGeolocationId
            }
          });

        if (!professorGeolocatinCoordinates) {
          return {
            success: false,
            message: 'no coordinates found for this professor ID'
          };
        }

        const professorLatitude =
          professorGeolocatinCoordinates.lectureLatitude;
        const professorLongtitude =
          professorGeolocatinCoordinates.lectureLongitude;
        const studentLatitude = requestData.input.studentLatitude;
        const studentLongtitude = requestData.input.studentLongtitude;

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
          professorLatitude,
          professorLongtitude,
          studentLatitude,
          studentLongtitude
        );

        console.log('Got here!');

        return { success: true, distance: calculateDistance };
      } catch (error) {
        throw error;
      }
    })
});

export type GeolocationRouter = typeof geolocationRouter;
