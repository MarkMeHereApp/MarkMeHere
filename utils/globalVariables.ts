export const attendanceTokenExpirationTime = 5 * 60 * 1000; // 5 minutes

export const qrCodeExpirationTime = 5 * 1000; // 5 seconds

// When a student scans a QR code right before it expires,
// the server may not have enough time to process the request
// so we add a leeway to the QR code expiration time.
export const qrCodeLeeWay = 2 * 1000; // 2
