'use client';
import { CardTitle } from '@/components/ui/card';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ProfessorLectureGeolocation } from '@prisma/client';

import GoogleMapsComponent from '../../../(student)/verification/components/googleMapsComponent';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Geolocation } from './generate-qr-code';
import { Slider } from '@/components/ui/slider';
import Cookies from 'js-cookie';

export const GetProfessorGeolocationData = ({
  setProfessorGeolocation,
  setDialogOpen
}: {
  setProfessorGeolocation: React.Dispatch<
    React.SetStateAction<Geolocation | null>
  >;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [internalProfessorGeolocation, setInternalProfessorGeolocation] =
    useState<Geolocation | null>(null);
  const [gettingLocation, setGettingLocation] = useState(true);
  useState<ProfessorLectureGeolocation | null>(null);

  const saveLocation = async () => {
    if (internalProfessorGeolocation) {
      Cookies.set('range', internalProfessorGeolocation.radius.toString());
      setProfessorGeolocation(internalProfessorGeolocation);
    }
    setDialogOpen(false);
  };

  const noLocation = () => {
    setButtonLoading(false);
    setGettingLocation(false);
    setInternalProfessorGeolocation(null);
  };

  const getLocation = async () => {
    try {
      setButtonLoading(true);
      setGettingLocation(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            if (!lat || !long) {
              noLocation();
              return;
            }

            //setProfessorRadius(distance);
            setInternalProfessorGeolocation({
              latitude: lat,
              longitude: long,
              radius: Number(Cookies.get('range')) || 500
            });
            setGettingLocation(false);
            setButtonLoading(false);
          },
          (error) => {
            noLocation();
            return;
          }
        );
      }
    } catch (error) {
      noLocation();
    }
  };

  const CancelButton = () => {
    return (
      <Button
        variant={'outline'}
        className="w-full"
        onClick={() => {
          setDialogOpen(false);
        }}
      >
        Cancel
      </Button>
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (buttonLoading) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Loading</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-full  justify-center">
          <ReloadIcon
            className="animate-spin "
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      </>
    );
  }

  if (gettingLocation) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>Getting Your Location</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-full  justify-center">
          <ReloadIcon
            className="animate-spin "
            style={{ height: '100px', width: '100px' }}
          />
        </div>
      </>
    );
  }

  if (internalProfessorGeolocation !== null) {
    return (
      <>
        <CardTitle className="text-2xl font-bold  text-center">
          <span>We Found Your Location!</span>
        </CardTitle>
        <div className="gap-4 flex flex-col items-center pt-5 w-full">
          <GoogleMapsComponent
            professorLatitude={internalProfessorGeolocation.latitude}
            professorLongitude={internalProfessorGeolocation.longitude}
            professorRadius={internalProfessorGeolocation.radius}
          />
          <div className="flex w-full my-4">
            <div className="flex-grow">
              <div className="my-4">
                Range {internalProfessorGeolocation.radius} feet
              </div>
              <Slider
                defaultValue={[internalProfessorGeolocation.radius || 500]}
                max={4000}
                min={200}
                step={100}
                className=""
                onValueCommit={(value) => {
                  setInternalProfessorGeolocation((prevState) => {
                    if (prevState === null) {
                      return null;
                    }

                    return {
                      ...prevState,
                      radius: value[0]
                    };
                  });
                }}
              />
            </div>
          </div>
          <Button
            className="flex w-full"
            onClick={() => {
              saveLocation();
            }}
          >
            Save Location
          </Button>
          <CancelButton />
        </div>
      </>
    );
  }

  return (
    <>
      <CardTitle className="text-2xl font-bold  text-center">
        <span>Could Not Get Your Location!</span>
      </CardTitle>
      <div className="gap-4 flex flex-col items-center  pt-5 w-full justify-center">
        Please Make Sure You Have Enabled Location in Your Browser.
        <Button
          className="flex w-full"
          onClick={() => {
            getLocation();
          }}
        >
          Try Again?
        </Button>
        <CancelButton />
      </div>
    </>
  );
};
export default GetProfessorGeolocationData;
