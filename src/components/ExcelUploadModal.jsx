// src/components/ExcelUploadModal.jsx
import React, { useState } from "react";
import { uploadExcel } from "../api/excel";

export default function ExcelUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError("");
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, seleccione un archivo.");
      return;
    }
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const data = await uploadExcel(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  // Al cerrar, si hay resultado exitoso se llama al callback onUploadSuccess para refrescar la tabla
  const handleClose = () => {
    if (result && onUploadSuccess) {
      onUploadSuccess();
    }
    // Reiniciar estados y cerrar modal
    setFile(null);
    setUploadProgress(0);
    setResult(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mx-4">
        <h2 className="text-xl font-bold mb-4">Importar Excel</h2>
        <div className="mb-4">
          <label
            htmlFor="excelFile"
            className="block border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer rounded hover:bg-gray-50"
          >
            {file ? file.name : "Selecciona un archivo Excel (.xls, .xlsx)"}
            <input
              id="excelFile"
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        {uploading && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{uploadProgress}%</p>
          </div>
        )}
        {result && (
          <div className="mb-4 p-4 border rounded bg-green-50 text-green-800">
            <p>Estudiantes creados: {result.successCount}</p>
            <p>Estudiantes fallidos: {result.failureCount}</p>
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-2 list-disc list-inside">
                {result.errors.map((err, index) => (
                  <li key={index} className="text-sm">{err}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 border rounded bg-red-50 text-red-800">
            {error}
          </div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded border"
            disabled={uploading}
          >
            Cerrar
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-purple-600 text-white rounded"
            disabled={uploading}
          >
            {uploading ? "Subiendo..." : "Subir Archivo"}
          </button>
        </div>
      </div>
    </div>
  );
}
