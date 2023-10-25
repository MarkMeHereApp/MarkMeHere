import React from 'react';
import { GoogleMap, LoadScript, Marker, MarkerF } from '@react-google-maps/api';
import { Float } from '@react-three/drei';
import { number } from 'zod';
import googleMapsDark from './googleMapsStyles/googleMapsDarkMode.json';
import googleMapsLight from './googleMapsStyles/googleMapsLightMode.json'
import { useTheme } from 'next-themes';

type PositionData = {
    studentLatitude: number;
    studentLongitude: number;
    professorLatitude: number;
    professorLongitude: number;
  };


const GoogleMapsComponent: React.FC<{postitonsData?:PositionData}> = ({postitonsData}) => {
    const mapStyles = {        
        height: "300px",
        width: "100%",
        borderRadius:"6px"
    };

    const {theme} = useTheme();
    const isDarkMode = theme?.startsWith('dark_');
    const mapTheme = {
        styles: isDarkMode ? googleMapsDark : googleMapsLight
    };


    if(postitonsData){
        const { studentLatitude, studentLongitude, professorLatitude, professorLongitude } = postitonsData;

        const professorLocation = {
            lat: professorLatitude, lng: professorLongitude
        }
        
        const studentLocation = {
            lat: studentLatitude, lng: studentLongitude
        }

        console.log()

        return (
            <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={16}
                center={professorLocation}
                options={{
                    styles:mapTheme.styles,
                    mapTypeControl:false,
                    zoomControl:false,
                    fullscreenControl:false,
                    streetViewControl:false,
                
                }}
                >
                <MarkerF 
                    position={professorLocation} 
                    title='my place'
                    // icon={{
                    //     url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Ccircle cx='25' cy='25' r='25' fill='%23ff0000'/%3E%3C/svg%3E",
                    //     scaledSize: new window.google.maps.Size(50, 50)
                    // }}
                />
                <MarkerF 
                    position={studentLocation} 
                    title='my place'
                />
            </GoogleMap>
            </LoadScript>
        )
    }

    else{
        return <></>
    }
    
  
    
}
export default GoogleMapsComponent;
