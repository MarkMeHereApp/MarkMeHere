// const validateAndCreateAttendanceTokenWithGeolocation =
//     trpc.attendanceToken.ValidateAndCreateAttendanceTokenWithGeolocation.useMutation();
//   const checkGeolocation = async () => {
//     setIsLoadingSubmit(true); // Set loading to true at the start of the function
    
//     try {
//       const res = await validateAndCreateAttendanceTokenWithGeolocation.mutateAsync({
//         code: inputValue,
//         studentLatitude: studentLatitude.current,
//         studentLongtitude: studentLongitude.current
//       });

//       console.log(res);

//       // if (res.success) {
//       //   router.push(`/student?attendanceTokenId=${res.token}`);
//       // }

//       if (!res.success) {
        
//         displayError(ErrorType.InvalidInput);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoadingSubmit(false); // Set loading to false at the end of the function
//     }
//   };