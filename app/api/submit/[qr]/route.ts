import { NextResponse } from 'next/server'

//This will be the route hit by people who scan the qr code.
//This route should check if the qr code is valid
//If it is not valid throw an error
//If it is valid 
//Generate attendance session token in session table corresponding with the class
//qr will probably need to pass class id as well as qr code to this route
//redirect to submission endpoint/page? where attendance session is 
//submitted form url parameter
 
export async function GET() {
 

  return NextResponse.json( "test" )
}