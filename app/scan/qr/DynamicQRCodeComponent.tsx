import React from 'react';
import QRCode from "react-qr-code";

export default function QRCodeComponent({ url }: { url: string }) {

  return (
    <QRCode
        size={Math.max(window.innerWidth, window.innerHeight)}
        style={{ height: "100vh", width: "100vw", maxWidth: "100%", maxHeight: "100%" }}
        value={url}
        viewBox={`0 0 ${Math.max(window.innerWidth, window.innerHeight)} ${window.innerHeight}`}
        className="flex flex-col items-center justify-center text-2xl mb-4"
    />
  );
}