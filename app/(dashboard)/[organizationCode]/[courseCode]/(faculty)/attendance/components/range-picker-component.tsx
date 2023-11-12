import React, { FC } from 'react';
import {
  GoogleMap,
  useLoadScript,
  CircleF,
} from '@react-google-maps/api';
import googleMapsLight from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsDarkMode.json';
import googleMapsDark from '@/app/(dashboard)/[organizationCode]/[courseCode]/(student)/verification/components/googleMapsStyles/googleMapsLightMode.json';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useOrganizationContext } from '@/app/(dashboard)/[organizationCode]/context-organization';
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

type PositionData = {
  professorLatitude: number;
  professorLongitude: number;
};

interface GoogleMapsProps {
  postitonsData?: PositionData;
}

const GoogleMapComponentAttendance: FC<
  GoogleMapsProps & {
    onRangeChange: (newRange: number) => void;
    isDialogOpen: (newBoolean: boolean) => void;
  }
> = ({ postitonsData, onRangeChange, isDialogOpen }) => {
  const [range, setRange] = useState<number>(200);

  const OrganizationContext = useOrganizationContext();
  const GoogleMapsKey = OrganizationContext.organization.googleMapsApiKey;

  function feetToMeter(feet: number) {
    return feet / 3.28084;
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

  if (!postitonsData) {
    return null;
  }

  const { professorLatitude, professorLongitude } = postitonsData;

  const professorLocation = {
    lat: professorLatitude,
    lng: professorLongitude
  };

  const [defaultValueRadio, setDefaultValueRadio] = useState('medium');

  const setDefaultValue = (defaultValue: string) => {
    setDefaultValueRadio(defaultValue);
  };

  const calculateZoomLevel = (rangeInFeet: number) => {
    const rangeInKm = rangeInFeet * 0.0003048; // convert feet to kilometers
    return Math.round(13 - Math.log(rangeInKm) / Math.LN2);
  };

  const RangePicker = () => {
    return (
      <div>
        <div className="pt-[10px]">
          <RadioGroup
            defaultValue={defaultValueRadio}
            className="flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <div>
                <div className="flex items-center">
                  <RadioGroupItem
                    onClick={() => {
                      setRange(50);
                      setDefaultValue('small');
                    }}
                    value="small"
                  />
                  <AlertDialogDescription className="pl-[10px]">
                    Small - 50ft
                  </AlertDialogDescription>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem
                    onClick={() => {
                      setRange(150);
                      setDefaultValue('medium');
                    }}
                    value="medium"
                  />
                  <AlertDialogDescription className="pl-[10px]">
                    Medium - 150ft
                  </AlertDialogDescription>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem
                    onClick={() => {
                      setRange(250);
                      setDefaultValue('large');
                    }}
                    value="large"
                  />
                  <AlertDialogDescription className="pl-[10px]">
                    Large - 250ft
                  </AlertDialogDescription>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem
                    onClick={() => {
                      setRange(2500);
                      setDefaultValue('campus');
                    }}
                    value="campus"
                  />
                  <AlertDialogDescription className="pl-[10px]">
                    Campus - 2500ft
                  </AlertDialogDescription>
                </div>
              </div>

              <div className="w-[30%] flex flex-row items-end">
                <DialogFooter className="w-[100%]">
                  <Button
                    className="flex w-[100%]"
                    onClick={() => {
                      isDialogOpen(false);
                      onRangeChange(range);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  };

  const MapComponent = () => {
    const zoomLevel = calculateZoomLevel(range);

    return (
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={zoomLevel}
        center={professorLocation}
        options={{
          styles: mapTheme.styles,
          mapTypeControl: false,
          zoomControl: false,
          fullscreenControl: false,
          streetViewControl: false
        }}
      >
        <CircleF
          center={professorLocation}
          radius={feetToMeter(range)} // radius in meters
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
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
    return (
      <div>
        <AlertDialog>
          <AlertDialogHeader className="flex justify-center items-center pb-[10px]">
            <AlertDialogTitle>Location Verification Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Please select a size of your classroom and verify your location is
              correct!
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialog>

        <MapComponent></MapComponent>
        <RangePicker></RangePicker>
      </div>
    );
  } else {
    return (
      <div>
        <AlertDialog>
          <AlertDialogHeader className="flex justify-center items-center pb-[10px]">
            <AlertDialogTitle>Location Verification Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile does not have Google Maps API key imported! You can still
              pick the size of your classroom, but you cannot see where your
              location is. Be careful not to have a VPN on so the data is
              accurate!
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialog>
        <RangePicker></RangePicker>
      </div>
    );
  }
};

export default GoogleMapComponentAttendance;
