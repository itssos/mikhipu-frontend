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
      } catch (_) { }
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
          } catch (_) { }
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
        () => { }
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
    <div className="qr-panel max-w-md mx-auto mt-6 mb-12">
      <style>{`
      .qr-panel {
        background-color: #f0e1ac;
        border: 8px solid #574d32;
        border-radius: 28px 28px 32px 32px;
        box-shadow: 0 0 24px #000a, 0 4px 24px #d3c19144;
        padding: 28px 22px 26px 22px;
        position: relative;
      }
      .qr-title {
        font-size: 1.7rem;
        color: #69541c;
        text-align: center;
        margin-bottom: 2.1rem;
        text-shadow: 1px 2px #fff6d2, 2px 5px 16px #b6a07788;
        letter-spacing: 2px;
        font-family: 'Pirata One', cursive;
      }
      .qr-select, .qr-panel select {
        width: 100%;
        padding: 10px 13px;
        border-radius: 14px;
        background: #efe6c8;
        border: 2.5px solid #c9ad74;
        margin-bottom: 0.7rem;
        font-family: 'Pirata One', cursive;
        font-size: 1.09rem;
        color: #5d4420;
        box-shadow: 1px 2px #efe6c8bb;
        transition: border .16s;
      }
      .qr-select:focus, .qr-panel select:focus {
        border-color: #715f3a;
        outline: none;
        background: #fffbe6;
      }
      .qr-label {
        font-weight: bold;
        color: #7e5d13;
        margin-bottom: 0.2rem;
        font-size: 1rem;
        font-family: 'Pirata One', cursive;
      }
      .qr-camera-frame {
        width: 300px;
        height: 300px;
        margin: 0 auto 14px auto;
        border-radius: 18px;
        background: linear-gradient(135deg, #f3e6c1 80%, #b8a26c 100%);
        border: 4.5px dashed #a87e42;
        position: relative;
        box-shadow: 0 2px 16px #b3933260;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .qr-preview-label {
        color: #b69c65;
        font-size: 1.15rem;
        font-family: 'Pirata One', cursive;
        opacity: 0.88;
      }
      .qr-btn {
        flex: 1;
        font-family: 'Pirata One', cursive;
        font-size: 1.08rem;
        font-weight: bold;
        border-radius: 16px;
        padding: 12px 0;
        border: none;
        box-shadow: 0 1px 4px #b6a07750;
        transition: background .13s, color .13s, transform .1s;
        margin-top: 10px;
        cursor: pointer;
        letter-spacing: 1px;
      }
      .qr-btn-start {
        background: linear-gradient(120deg, #b3e37a 60%, #45a844 100%);
        color: #2e4b1d;
      }
      .qr-btn-start:active { background: #66bb5b; }
      .qr-btn-stop {
        background: linear-gradient(120deg, #f87171 40%, #db2828 100%);
        color: #fffbe0;
      }
      .qr-btn-stop:active { background: #ad2121; }
      @media (max-width: 450px) {
        .qr-camera-frame { width: 99vw; height: 56vw; min-height: 180px; min-width: 180px; }
      }
    `}</style>

      <h2 className="qr-title">🚪 Escaneo de QR</h2>

      <div className="mb-5">
        <label className="qr-label" htmlFor="scan-type">Tipo de registro:</label>
        <select
          className="qr-select"
          id="scan-type"
          value={scanType}
          onChange={e => setScanType(e.target.value)}
          disabled={scanning}
        >
          <option value="entry">Entrada</option>
          <option value="exit">Salida</option>
        </select>
        <label className="qr-label" htmlFor="camera-select">Selecciona Cámara:</label>
        <select
          className="qr-select"
          id="camera-select"
          value={selectedCamera || ""}
          onChange={e => setSelectedCamera(e.target.value)}
          disabled={scanning}
        >
          {cameras.map(cam => (
            <option key={cam.id} value={cam.id}>{cam.label || "Cámara desconocida"}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="qr-camera-frame relative mb-1 max-w-full">
          <div
            id={regionId}
            className="absolute top-0 left-0 w-full h-full"
            style={{ borderRadius: 18, zIndex: 2 }}
          />
          {!scanning && (
            <span className="qr-preview-label absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
              Vista previa de la cámara aquí
            </span>
          )}
        </div>
        <div className="flex gap-3 w-full">
          {!scanning ? (
            <button
              className="qr-btn qr-btn-start"
              onClick={startScanLoop}
              disabled={!selectedCamera}
            >
              Iniciar escaneo
            </button>
          ) : (
            <button
              className="qr-btn qr-btn-stop"
              onClick={stopScan}
            >
              Detener escaneo
            </button>
          )}
        </div>
      </div>
    </div>
  );

}
