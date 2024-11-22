"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useState, useEffect, useRef } from "react";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [backCameraId, setBackCameraId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Fetch available cameras and find the back camera
    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (cameras && cameras.length) {
          const backCamera = cameras.find((camera) =>
            camera.label.toLowerCase().includes("back") || camera.label.toLowerCase().includes("environment")
          );
          setBackCameraId(backCamera ? backCamera.id : cameras[0].id); 
        }
      })
      .catch((err) => {
        console.error("Error fetching cameras:", err);
      });
  }, []);

  const startScanner = () => {
    if (!backCameraId) {
      console.error("No camera available.");
      return;
    }

    setResult(null);
    setIsScanning(true);

    // Initialize scanner
    scannerRef.current = new Html5Qrcode("qr-reader");
    scannerRef.current
      .start(
        backCameraId,
        {
          fps: 10, 
          qrbox: 250, 
        },
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
      )
      .catch((err) => {
        console.error("Error starting scanner:", err);
      });
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
      }).catch(console.error);
    }
    setIsScanning(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>

      {!isScanning ? (
        <button onClick={startScanner} disabled={!backCameraId}>
          Start Scan
        </button>
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
