"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useState, useEffect, useRef } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false); 
  const [result, setResult] = useState<string | null>(null); 
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = () => {
    setResult(null); 
    setIsScanning(true);

    // Create the scanner instance and render
    scannerRef.current = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }, 
    }, false);

    scannerRef.current.render(
      (decodedText: string) => {
        console.log("QR Code Scanned:", decodedText);
        setResult(decodedText); 
        onScanSuccess(decodedText);
        stopScanner(); 
      },
      (error: any) => {
        console.warn("QR Scan Error:", error);
        onScanFailure && onScanFailure(error); 
      }
    );
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    setIsScanning(false); 
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>QR Code Scanner</h1>
      
      {!isScanning ? (
        <button onClick={startScanner}>Start Scan</button>
      ) : (
        <button onClick={stopScanner}>Stop Scan</button>
      )}

      <div id="qr-reader" style={{ width: "300px", margin: "20px auto" }}></div>

      {result && (
        <div>
          <h2>Scanned Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
