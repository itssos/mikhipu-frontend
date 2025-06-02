import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StudentQRGeneratorButton({ id }) {
  const qrCanvasRef = useRef();

  const downloadQR = () => {
    // QRCodeCanvas usa forwardRef y el nodo real es canvas
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-qr-${id}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <QRCodeCanvas
        value={String(id)}
        size={256}
        includeMargin={true}
        ref={qrCanvasRef}
        className="mb-2"
      />
      <button
        onClick={downloadQR}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl shadow transition-all"
      >
        Download Student QR
      </button>
    </div>
  );
}
