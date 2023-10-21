import QRCode from 'react-qr-code';

export default function QRCodeComponent({ url }: { url: string }) {
  return (
    <QRCode
      bgColor="white" //#0B0A09
      fgColor="black" //#FFC904
      size={Math.max(window.innerWidth, window.innerHeight)}
      style={{
        height: '100vh',
        width: '100vw',
        maxWidth: '100%',
        maxHeight: '100%'
      }}
      value={url}
      viewBox={`0 0 ${Math.max(window.innerWidth, window.innerHeight)} ${
        window.innerHeight
      }`}
      className="flex flex-col items-center justify-center text-2xl mb-4"
    />
  );
}

// import QRCode from 'qrcode.react';

// export default function QRCodeComponent({ url }: { url: string }) {
//   return (
//     <QRCode
//       value={url}
//       size={256}
//       fgColor="#000000"
//       bgColor="#ffffff"
//       level="Q"
//       includeMargin={false}
//       renderAs="svg"
//       imageSettings={{
//         src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><text y='8' font-size='5' fill='red'>JOS123</text></svg>",
//         height: 24,
//         width: 24,
//         excavate: true,
//       }}
//     />
//   );
// }
