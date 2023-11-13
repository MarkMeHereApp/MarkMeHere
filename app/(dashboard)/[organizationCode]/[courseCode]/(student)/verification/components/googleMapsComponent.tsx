import React, { FC } from 'react';
import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  CircleF,
  Polyline,
  PolygonF,
  PolylineF
} from '@react-google-maps/api';
import googleMapsDark from './googleMapsStyles/googleMapsDarkMode.json';
import googleMapsLight from './googleMapsStyles/googleMapsLightMode.json';
import { useTheme } from 'next-themes';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';

interface GoogleMapsProps {
  studentLatitude: number;
  studentLongitude: number;
  professorLatitude: number;
  professorLongitude: number;
  professorRadius: number;
}

const GoogleMapsComponent = ({
  studentLatitude,
  studentLongitude,
  professorLatitude,
  professorLongitude,
  professorRadius
}: GoogleMapsProps) => {
  const OrganizationContext = useOrganizationContext();
  const GoogleMapsKey = OrganizationContext.organization.googleMapsApiKey;

  function feetToMeters(meters: number) {
    return meters / 3.28084;
  }

  const mapStyles = {
    height: '300px',
    width: '100%',
    borderRadius: '6px'
  };

  const { theme } = useTheme();
  const isDarkMode = theme?.startsWith('dark_');
  const mapTheme = {
    styles: isDarkMode ? googleMapsDark : googleMapsLight
  };

  const professorLocation = {
    lat: professorLatitude,
    lng: professorLongitude
  };

  const studentLocation = {
    lat: studentLatitude,
    lng: studentLongitude
  };

  const MapComponent = () => {
    return (
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={16}
        center={professorLocation}
        options={{
          styles: mapTheme.styles,
          mapTypeControl: false,
          zoomControl: true,
          fullscreenControl: false,
          streetViewControl: false
        }}
      >
        <CircleF
          center={professorLocation}
          radius={feetToMeters(professorRadius)} // radius in meters
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          }}
        />
        <MarkerF position={studentLocation} />
        <PolylineF
          path={[studentLocation, professorLocation]}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 2
          }}
        />
      </GoogleMap>
    );
  };

  if (GoogleMapsKey) {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: GoogleMapsKey || ''
    });

    if (loadError) {
      return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
      return <div>Loading Google Maps</div>;
    }
  }

  if (GoogleMapsKey) {
    return <MapComponent></MapComponent>;
  } else {
    return (
      <div className="py-6">
        <div className="text-center">Your location has been discovered!</div>
      </div>
    );
  }
};

export default GoogleMapsComponent;
