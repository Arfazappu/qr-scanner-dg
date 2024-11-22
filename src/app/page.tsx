'use client'
import QRScanner from "./component/Qrcode";

const QRScannerPage = () => {
  const handleScanSuccess = (decodedText: string) => {
    console.log("Scanned QR Code: ", decodedText);
  };

  const handleScanFailure = (error: any) => {
    console.error("Scanning failed:", error);
  };

  return (
    <div>
      <QRScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
    </div>
  );
};

export default QRScannerPage;
