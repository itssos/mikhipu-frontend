// src/components/student/StudentQRScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import {
  registerAssistanceEntry,
  registerAssistanceExit,
} from "../../api/assistance";

export default function StudentQRScanner({ onScan }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState("entry"); // "entry" o "exit"
  const html5QrCodeRef = useRef(null);
  const regionId = "qr-scanner-region";
  const keepScanningRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    Html5Qrcode.getCameras().then((devices) => {
      if (!isMounted) return;
      setCameras(devices);
      if (devices.length > 0) setSelectedCamera(devices[0].id);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    return () => { stopScan(true); };
  }, []);

  const stopScan = async (forceUnmount = false) => {
    keepScanningRef.current = false;
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (_) {}
      html5QrCodeRef.current = null;
      setScanning(false)
    }
  };

  // Escanea, llama API y muestra toast, reinicia si corresponde
  const scanOnce = async () => {
    setScanning(true);
    keepScanningRef.current = true;
    const qrCodeScanner = new Html5Qrcode(regionId);
    html5QrCodeRef.current = qrCodeScanner;
    let hasScanned = false;
    try {
      await qrCodeScanner.start(
        selectedCamera,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (hasScanned) return; // no duplicados
          hasScanned = true;
          try {
            await qrCodeScanner.stop();
          } catch (_) {}
          html5QrCodeRef.current = null;
          setScanning(false);

          // Aquí procesamos el QR
          let apiFn =
            scanType === "entry" ? registerAssistanceEntry : registerAssistanceExit;
          try {
            const res = await apiFn({ studentId: decodedText }); 
            if (onScan) onScan(decodedText, res); 
            toast.success(
              `Escaneo (${scanType === "entry" ? "Entrada" : "Salida"}): ` +
                (res?.studentFullName || decodedText),
              { autoClose: 1200 }
            );
          } catch (err) {
            toast.error(
              "Error registrando " +
                (scanType === "entry" ? "entrada" : "salida") +
                ": " +
                (err?.response?.data?.message || err.message || "Error desconocido")
            );
          }

          setTimeout(() => {
            if (keepScanningRef.current) {
              scanOnce();
            }
          }, 1200);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      html5QrCodeRef.current = null;
      toast.error("No se pudo iniciar el escaneo: " + err);
    }
  };

  const startScanLoop = () => {
    if (!selectedCamera || scanning) return;
    keepScanningRef.current = true;
    scanOnce();
  };

  useEffect(() => {
    if (scanning) stopScan();
    // eslint-disable-next-line
  }, [selectedCamera]);

  return (
    <div className="max-w-md mx-auto p-4 rounded-2xl shadow-xl bg-white ">
      <h2 className="text-2xl font-bold mb-4 text-center">QR Scanner</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Tipo de registro:</label>
        <select
          className="w-full rounded-lg border-gray-300 px-3 py-2 mb-2"
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          disabled={scanning}
        >
          <option value="entry">Entrada</option>
          <option value="exit">Salida</option>
        </select>
        <label className="block font-semibold mb-1">Selecciona Cámara:</label>
        <select
          className="w-full rounded-lg border-gray-300 px-3 py-2"
          value={selectedCamera || ""}
          onChange={e => setSelectedCamera(e.target.value)}
          disabled={scanning}
        >
          {cameras.map(cam => (
            <option key={cam.id} value={cam.id}>{cam.label || "Unnamed Camera"}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-[300px] h-[300px] mb-2 relative">
          <div
            id={regionId}
            className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 transition-all duration-300"
          />
          {!scanning && (
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none select-none">
              Camera preview here
            </span>
          )}
        </div>

        <div className="flex gap-3 w-full">
          {!scanning ? (
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-all"
              onClick={startScanLoop}
              disabled={!selectedCamera}
            >
              Start Scan
            </button>
          ) : (
            <button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-all"
              onClick={stopScan}
            >
              Stop Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
