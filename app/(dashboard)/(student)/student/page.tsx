'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from 'components/ui/use-toast';

const StudentPage: React.FC = () => {
  const searchParams = useSearchParams();

  useEffect(() => {

    if (searchParams.has('qr-warning')) {
      toast({
        title: 'Unable To Display QR Code.',
        description:
          'You must be a Professor or TA in the selected course to generate a QR code.',
        icon: 'warning'
      });
    }
  }, []);


  return (
    <div>
      <h1>This is the student page!</h1>
    </div>
  );
};

export default StudentPage;
