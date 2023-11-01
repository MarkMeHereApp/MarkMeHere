'use client'
import React, {  useEffect,useState,useRef, useMemo, use } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"; 
import GoogleMapsComponent from "./googleMapsComponent";
import { Button } from "@/components/ui/button";

type PositionData = {
studentLatitude: number;
studentLongitude: number;
professorLatitude: number;
professorLongitude: number;
};

const VerificationDialog: React.FC<{postitonsData?:PositionData}> = ({postitonsData}) =>{


    return (
        <>  
            <DialogContent>
                  <GoogleMapsComponent postitonsData={postitonsData}></GoogleMapsComponent>
                    <Button onClick={() => {
                        console.log('clicked verified')
                    }}>
                      
                        <div>
                          {`Continue with Location`}
                        </div>
                    </Button>

                    <Button
                      variant="destructive"
                      >
                      <div>
                        Cancel
                      </div>
                    </Button>
                </DialogContent>
                
        </>
        )
}

export default VerificationDialog