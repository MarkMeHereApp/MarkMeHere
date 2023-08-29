'use client';

import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"


export function StartScanningButton() {
 
  const router = useRouter();
 
  const address = "localhost:3000"
  const navigation = '/scan/qr'



  const [isCopied, setCopied] = useState(false);
  const [svgValue, setSvgValue] = useState('M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z');
  const [parameters, setParameters] = useState('?mode=default');

  useEffect(() => {
    if (isCopied) {
      setSvgValue('M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z');
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    } else {
      setSvgValue('M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002H5.5C4.67158 4.00002 4 4.67159 4 5.50002V12.5C4 13.3284 4.67158 14 5.5 14H12.5C13.3284 14 14 13.3284 14 12.5V5.50002C14 4.67159 13.3284 4.00002 12.5 4.00002H11V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5 5.50002C5 5.22388 5.22386 5.00002 5.5 5.00002H12.5C12.7761 5.00002 13 5.22388 13 5.50002V12.5C13 12.7762 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7762 5 12.5V5.50002Z');
    }
  }, [isCopied]);
  


  const handleCopyUrl = () => {
    navigator.clipboard.writeText(address + navigation + parameters);
    setCopied(true);
  }

  const onNewQRSettings = (newSetting: string) => {
    setParameters(newSetting);
    Cookies.set('qrSettings', newSetting)
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
        <Button >
          Generate QR Code
        </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Display QR Code</AlertDialogTitle>
            <AlertDialogDescription>

            <RadioGroup 
              defaultValue={Cookies.get('qrSettings') ? Cookies.get('qrSettings') : "?mode=default"}
              className='p-4'

             >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                      onClick={() => onNewQRSettings("?mode=default")}
                      value="?mode=default" 
                      id="r1" />
                      <Label htmlFor="r1">Default</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This option displays both a QR code and a manual entry code for students without a phone/camera.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        onClick={() => onNewQRSettings("?mode=hide-code")}
                        value="?mode=hide-code" 
                        id="r2" />
                      <Label htmlFor="r2">Hide Code</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This option only displays the QR code, concealing the manual entry code that students could otherwise use.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                      onClick={() => onNewQRSettings("?mode=minimal")}
                      value="?mode=minimal" 
                      id="r3" />
                      <Label htmlFor="r3">Minimal</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This option displays only the QR code in a simplified format. It&apos;s best suited for presentations footers where distractions need to be minimized.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

            </RadioGroup>

            <div className="flex items-center space-x-2 pb-4 pl-4" >
            Now you can display the QR code by clicking the button below
            </div>

            <div className="flex items-center space-x-2 pl-4" >
              <Button onClick={() => router.push(navigation + parameters)} >
                Continue To QR Code
              </Button>
            </div>

            <div className="flex items-center space-x-2 p-4" >
              Or by going to this link:
            </div>
            
            <div className=" pl-4 flex-shrink-0" >
              <Card className="p-3">
                  <CardDescription className=" w-full">

                    <div className="flex justify-between  ">
                      <div className="whitespace-nowrap overflow-auto">
                        {address + navigation + parameters}
                      </div>
                      <Button variant="outline" size={"xs"} onClick={handleCopyUrl}>
                      <svg width="13" height="13" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d={svgValue} fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                          </path>
                      </svg>
                      </Button>
                    </div>
                  </CardDescription>
              </Card>
            </div>

            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


