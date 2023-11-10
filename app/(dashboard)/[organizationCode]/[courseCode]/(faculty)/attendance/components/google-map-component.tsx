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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

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


const GoogleMapComponentAttendance: FC<GoogleMapsProps & {onRangeChange: (newRange:number) => void, isDialogOpen: (newBoolean: boolean) => void}> = ({ postitonsData, onRangeChange, isDialogOpen }) => {

    console.log(postitonsData)

    const [range, setRange] = useState<number>(200)

    const newRangeSettings = (newSetting: number) =>{
        setRange(newSetting);
    }

    const OrganizationContext = useOrganizationContext()
    const GoogleMapsKey = OrganizationContext.organization.googleMapsApiKey

    function feetToMeter(feet: number){
        return feet / 3.28084
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
                radius={feetToMeter(range)} // radius in meters
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
                <MapComponent></MapComponent>
                <AlertDialogTitle>
                    
                </AlertDialogTitle>
                <div className='pt-[10px]'>
                <RadioGroup defaultValue = {'medium'} className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <div>
                            <div className='flex items-center'>
                                <RadioGroupItem
                                    onClick={() => newRangeSettings(50)}
                                    value='small'
                                />
                                <AlertDialogDescription className='pl-[10px]'>
                                    Small - 50ft
                                </AlertDialogDescription>
                                
                            </div>
                            <div className='flex items-center'>
                                <RadioGroupItem
                                    onClick={() => newRangeSettings(150)}
                                    value='medium'
                                />
                                <AlertDialogDescription className='pl-[10px]'>
                                    Medium - 150ft
                                </AlertDialogDescription>
                                
                            </div>
                            <div className='flex items-center'>
                                <RadioGroupItem
                                    onClick={() => newRangeSettings(250)}
                                    value='large'
                                />
                                <AlertDialogDescription className='pl-[10px]'>
                                    Large - 250ft
                                </AlertDialogDescription>
                            </div>  
                        
                            
                        </div>

                        <div>
                            <div className='flex items-center'>
                                <RadioGroupItem
                                    onClick={() => newRangeSettings(2500)}
                                    value='campus'
                                />
                                <AlertDialogDescription className='pl-[10px]'>
                                    Campus - 2500ft
                                </AlertDialogDescription>
                        </div>  
                        </div>
                    </div>

                </RadioGroup>

                <AlertDialogCancel className='pt-[10px]'onClick={() => {
                    isDialogOpen(false)
                    onRangeChange(range)                
                }}>
                Save
                </AlertDialogCancel>
                </div>
            </div>            
        );
    }

    else{
        return(
            <div className='pt-5'>
                <div className='text-center'></div>
            </div>
        )
            
    }


}

export default GoogleMapComponentAttendance;
