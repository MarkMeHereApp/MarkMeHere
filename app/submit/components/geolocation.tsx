import { Button } from "@/components/ui/button";
import { useEffect } from "react";


const GeoLocationChecker = () => {

    // const [latitude,set]

    const CheckGeolocation = () =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            }, (error) => {
                console.error("Error occurred while getting geolocation", error);
            });
            } else {
            console.log("Geolocation is not supported by this browser.");
            }
    }

    useEffect(() => {
        
    }, []);
    
    return(
      <div className='bg-red-500'>
        <Button onClick={() => CheckGeolocation()}>
            Check the Geolocation
        </Button>
      </div>
    );
  };

  export default GeoLocationChecker