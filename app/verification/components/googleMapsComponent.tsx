import React from 'react';
import { GoogleMap, LoadScript, Marker, MarkerF } from '@react-google-maps/api';
import { Float } from '@react-three/drei';
import { number } from 'zod';
import googleMapsStyles from './googleMaps.json';


const GoogleMapsComponent: React.FC<{ latitude?: number, longtitude?: number }> = ({ latitude,longtitude }) => {
    const mapStyles = {        
        height: "300px",
        width: "100%",
        stylers: [
            {}
          ]
    };

    

    if(latitude && longtitude){

        const defaultCenter = {
            lat: latitude, lng: longtitude
        }

        console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

        return (
            <LoadScript
            googleMapsApiKey={'AIzaSyDHPsrSbU-xlMq-vBkBBoG_YtxE1D4zwx4' || ''}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={12}
                center={defaultCenter}
                options={{styles:googleMapsStyles,
                mapTypeControl:false,
                zoomControl:false,
                fullscreenControl:false,
                streetViewControl:false,
                
                }}
                >
                <MarkerF 
                    position={defaultCenter} 
                    title='my place'
                     />
            </GoogleMap>
            </LoadScript>
        )
    }

    else{
        return null
    }
    
  
    
}
export default GoogleMapsComponent;
