import React, { FC } from 'react';
import { GoogleMap, Marker, MarkerF, useLoadScript, CircleF, Polyline, PolygonF, PolylineF } from '@react-google-maps/api';
import googleMapsLight from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsDarkMode.json'
import googleMapsDark from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsLightMode.json'
import { useTheme } from 'next-themes';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import {DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';


type PositionData = {
    studentLatitude: number;
    studentLongitude: number;
    professorLatitude: number;
    professorLongitude: number;
};

interface GoogleMapsProps {
    postitonsData?: PositionData;
}

interface GoogleMapsProps {
    postitonsData?: PositionData;
    validity?: number;
}

const LocationAttendanceView: FC<GoogleMapsProps> = ({ postitonsData, validity }) => {

    console.log(validity)

    const OrganizationContext = useOrganizationContext()
    const GoogleMapsKey = OrganizationContext.organization.googleMapsApiKey

    function feetToMeters(meters: number){
        return meters / 3.28084
    }

    const mapStyles = {        
        height: "300px",
        width: "100%",
        borderRadius:"6px"
    };

    const { theme } = useTheme();
    const isDarkMode = theme?.startsWith('dark_');
    const mapTheme = {
        styles: isDarkMode ? googleMapsDark : googleMapsLight
    };

    if (!postitonsData) {
        return null;
    }    

    const { studentLatitude, studentLongitude, professorLatitude, professorLongitude } = postitonsData;

    const professorLocation = {
         lat: professorLatitude, lng: professorLongitude
    }
        
    const studentLocation = {
        lat: studentLatitude, lng: studentLongitude
    }

    const MapComponent = () => {

        return(
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={16}
                center={professorLocation}
                options={{
                    styles: mapTheme.styles,
                    mapTypeControl: false,
                    zoomControl: false,
                    fullscreenControl: false,
                    streetViewControl: false,
                }}>

                <CircleF 
                center={professorLocation}
                radius={feetToMeters(50)}
                options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                }}
                />
                <MarkerF 
                    position={studentLocation} 
                />
                <PolylineF
                    path={[studentLocation, professorLocation]}
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.5,
                        strokeWeight: 2,                        
                    }}
                />
                
            </GoogleMap>
        )
    }

    if(GoogleMapsKey){
        const { isLoaded, loadError } = useLoadScript({
            googleMapsApiKey: GoogleMapsKey || '',
        });

        if (loadError) {
            return <div>Error loading Google Maps</div>;
        }
                
        if (!isLoaded) {
            return <div>Loading Google Maps</div>;
        }
    }
    
    if(GoogleMapsKey){

        if(validity == -1){
        
        }

        if(validity == 0){
            return (
                <div>
                    <DialogContent className="max-w-[600px] h-[430px] ">
                        <div className="grid gap-4 py-4 ">
                        <DialogHeader className="flex justify-center items-center pb-[5px]">
                            <DialogTitle>The student was out of range!</DialogTitle>
                                <DialogDescription>
                                    See the location of the lecture (circle) and the location of the student (marker).
                                </DialogDescription>
                        </DialogHeader>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col">
                                <MapComponent></MapComponent>
                            </div>
                        </div>
                    </DialogContent>
                
                </div>
                
            );
        }

        if(validity == 1){
        
        }
        
    }

    else{
        return(
            <div className='pt-5'>
                <div className='text-center'>Google Maps Api Key is not configured</div>
            </div>
        )       
    }
}

export default LocationAttendanceView;

