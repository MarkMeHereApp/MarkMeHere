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
import { DialogFooter } from '@/components/ui/dialog';
import { Dialog, DialogTrigger, DialogContent } from '@radix-ui/react-dialog';

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
    studentLatitude: number;
    studentLongtitude: number;
};

interface GoogleMapsProps {
    postitonsData?: PositionData;
}


const LocationAttendanceView: FC<GoogleMapsProps & {onRangeChange: (newRange:number) => void, isDialogOpen: (newBoolean: boolean) => void}> = ({ postitonsData, onRangeChange, isDialogOpen }) => {

    const [range, setRange] = useState<number>(200)

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

    const [defaultValueRadio, setDefaultValueRadio] = useState('medium')

    const setDefaultValue = (defaultValue: string) => {
        setDefaultValueRadio(defaultValue)
    }

    const calculateZoomLevel = (rangeInFeet:number) => {
        const rangeInKm = rangeInFeet * 0.0003048; // convert feet to kilometers
        return Math.round(13 - Math.log(rangeInKm) / Math.LN2);
    }

   
    const MapComponent = () => {
        const zoomLevel = calculateZoomLevel(range);

        return(
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={zoomLevel}
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

    //from here I need to just render the map component        
    if(GoogleMapsKey){
        return (
            <div>    
                <Dialog>
                    <DialogTrigger asChild>
                    <Button variant="outline" size="xs" className="pl-2 pr-2">
                        View Stats
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[1300px] h-full">
                    <div className="grid gap-4 py-4">
                    </div>
                    </DialogContent>
                </Dialog>

                <MapComponent></MapComponent>
            </div>            
        );
    }

    else{
        return(
            <div>
                <AlertDialog>
                    <AlertDialogHeader className='flex justify-center items-center pb-[10px]'>
                        <AlertDialogTitle>
                            Location Verification Settings
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Your profile does not have Google Maps imported!
                            You can still pick the size of your classroom, but you cannot see where your location is.
                            Be careful not to have a VPN on so the data is accurate!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialog>

                <AlertDialogDescription>
                    You are missing Google Maps key
                </AlertDialogDescription>
            </div>
        )
            
    }


}

export default LocationAttendanceView;
