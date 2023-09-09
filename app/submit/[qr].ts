import { useEffect } from 'react';

const ValidateQRPage = () => {
  useEffect(() => {
    const scanQRCodeAndValidate = async () => {
      try {
        const qrCodeData = '...'; // Extracted QR code data
        const response = await fetch(`/api/validation?data=${qrCodeData}`);
        
        if (response.ok) {
          // The QR code token is valid, redirect to success page
          window.location.href = '/success';
        } else {
          // The QR code token is not valid, redirect to error page
          window.location.href = '/error';
        }
      } catch (error) {
        console.error(error);
        // Handle any unexpected errors
        window.location.href = '/error';
      }
    };

    scanQRCodeAndValidate();
  }, []);

  return null; // You don't need to render anything on this page
};

export default ValidateQRPage;
