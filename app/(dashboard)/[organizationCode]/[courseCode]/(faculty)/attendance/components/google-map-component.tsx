import React, { FC } from 'react';
import { GoogleMap, Marker, MarkerF, useLoadScript, CircleF, Polyline, PolygonF, PolylineF } from '@react-google-maps/api';
import googleMapsLight from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsDarkMode.json'
import googleMapsDark from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsLightMode.json'
import { useTheme } from 'next-themes';
import {MdMyLocation} from 'react-icons/md'
import { IconContext } from "react-icons";
import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useState } from 'react';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '@/components/ui/alert-dialog';
import { Slider } from '@/components/ui/slider';
import { TemperatureSelector } from './range-slider';
import { SliderProps } from "@radix-ui/react-slider"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


const StudentSVG = renderToStaticMarkup(
  <IconContext.Provider value={{ 
    color: 'rgb(65,133,244)', 
    size: "2em", 
    style:{
        boxShadow: '0 0 10px #00f, 0 0 5px #00f', // blue glow
        textShadow: 'inherit'
    } }}>
    <MdMyLocation />
  </IconContext.Provider>
);

type PositionData = {
    professorLatitude: number;
    professorLongitude: number;
};

interface GoogleMapsProps {
    postitonsData?: PositionData;
}


const GoogleMapComponentAttendance: FC<GoogleMapsProps> = ({ postitonsData }) => {

    console.log(postitonsData)
    const [sliderValue, setSliderValue] = useState<number>(150);

    const [range, setRange] = useState<number>(200)

    const newRangeSettings = (newSetting: number) =>{
        setRange(newSetting);
    }

    const OrganizationContext = useOrganizationContext()
    const GoogleMapsKey = OrganizationContext.organization.googleMapsApiKey

    function metersToFeet(meters: number){
        return meters * 3.28084
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

    const {professorLatitude, professorLongitude } = postitonsData;

    const professorLocation = {
         lat: professorLatitude, lng: professorLongitude
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
                radius={metersToFeet(50)} // radius in meters
                options={{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                }}
                />
                <MarkerF 
                    position={professorLocation} 
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

    // const defaultRange = 'medium';
    // const activeRange = defaultRange
    

            
    if(GoogleMapsKey){
        return (
            <div>
                <AlertDialogHeader>Hello</AlertDialogHeader>
                <MapComponent></MapComponent>
                <AlertDialogTitle>
                    Select the size of your classroom and verify your location
                </AlertDialogTitle>
                <div className='pt-[10px]'>
                <RadioGroup defaultValue = {'medium'} className='flex flex-col '>
                    <div className='flex flex-col'>
                    <div className='flex items-center'>
                        <RadioGroupItem
                            onClick={() => newRangeSettings(100)}
                            value='small'
                        />
                        <AlertDialogDescription className='pl-[10px]'>
                            Small - 100ft
                        </AlertDialogDescription>
                        
                    </div>
                    <div className='flex items-center'>
                        <RadioGroupItem
                            onClick={() => newRangeSettings(200)}
                            value='medium'
                        />
                        <AlertDialogDescription className='pl-[10px]'>
                            Medium - 200ft
                        </AlertDialogDescription>
                        
                    </div>
                    <div className='flex items-center'>
                        <RadioGroupItem
                            onClick={() => newRangeSettings(300)}
                            value='large'
                        />
                        <AlertDialogDescription className='pl-[10px]'                        
>
                            Large - 300ft
                        </AlertDialogDescription> 
                        
                    </div>
                    </div>
                </RadioGroup>           
                </div>
            </div>            
        );
    }

    else{
        return(
            <div className='pt-5'>
                <div className='text-center'>Your location has been found!</div>
            </div>
        )
            
    }


}

export default GoogleMapComponentAttendance;
