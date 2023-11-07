import React, { FC } from 'react';
import { GoogleMap, Marker, MarkerF, useLoadScript, CircleF, Polyline, PolygonF, PolylineF } from '@react-google-maps/api';
import googleMapsDark from './googleMapsStyles/googleMapsDarkMode.json';
import googleMapsLight from './googleMapsStyles/googleMapsLightMode.json'
import { useTheme } from 'next-themes';
import {MdMyLocation} from 'react-icons/md'
import { IconContext } from "react-icons";
import { renderToStaticMarkup } from 'react-dom/server';
import { useEffect, useState } from 'react';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';


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
    studentLatitude: number;
    studentLongitude: number;
    professorLatitude: number;
    professorLongitude: number;
};

interface GoogleMapsProps {
    postitonsData?: PositionData;
}

const GoogleMapsComponent: FC<GoogleMapsProps> = ({ postitonsData }) => {

    const studentSvgDataUrl = `data:image/svg+xml,${encodeURIComponent(StudentSVG)}`;

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

    const { studentLatitude, studentLongitude, professorLatitude, professorLongitude } = postitonsData;

    const professorLocation = {
         lat: professorLatitude, lng: professorLongitude
    }
        
    const studentLocation = {
        lat: studentLatitude, lng: studentLongitude
    }

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GoogleMapsKey || '',
    });
            
    if (loadError) {
        return <div>Error loading Google Maps</div>;
    }
            
    if (!isLoaded) {
        return <div>Loading Google Maps</div>;
    }

    return (
        <div className='pt-5'>
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
                <MarkerF 
                    position={studentLocation} 
                    icon={{
                        url: studentSvgDataUrl,
                        scaledSize: new window.google.maps.Size(25, 25),
                    }}
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
        </div>
    );
}

export default GoogleMapsComponent;
