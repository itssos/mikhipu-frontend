// /src/components/assistance/AssistanceConfigForm.js
import React, { useEffect, useState } from "react";
import { getActiveAssistanceConfig, updateAssistanceConfig } from "../../api/assistance";
import { toast } from "react-toastify";

export default function AssistanceConfigForm() {
  const [config, setConfig] = useState({
    startEntryTime: "",
    endEntryTime: "",
    startExitTime: "",
    endExitTime: "",
    attendanceDeadline: "",
    id: null,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getActiveAssistanceConfig()
      .then(res => {
        setConfig(res);
      })
      .catch(() => {
        // Si no hay config activa, mantenemos los campos vacíos
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!config.id) {
      toast.error("No hay una configuración activa para actualizar.");
      return;
    }
    setSaving(true);
    try {
      await updateAssistanceConfig(config.id, {
        startEntryTime: config.startEntryTime,
        endEntryTime: config.endEntryTime,
        startExitTime: config.startExitTime,
        endExitTime: config.endExitTime,
        attendanceDeadline: config.attendanceDeadline,
      });
      toast.success("Configuración actualizada exitosamente");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" /></svg>
        Configuración de Asistencia
      </h2>
      {loading ? (
        <div className="py-8 text-center text-gray-400">
          <span className="animate-spin inline-block mr-2">&#9696;</span>
          Cargando configuración...
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hora de entrada (inicio)</label>
            <input
              type="time"
              name="startEntryTime"
              value={config.startEntryTime || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hora de entrada (fin)</label>
            <input
              type="time"
              name="endEntryTime"
              value={config.endEntryTime || ""}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Hora de salida (inicio)</label>
              <input
                type="time"
                name="startExitTime"
                value={config.startExitTime || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Hora de salida (fin)</label>
              <input
                type="time"
                name="endExitTime"
                value={config.endExitTime || ""}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Límite edición registros</label>
            <input
              type="datetime-local"
              name="attendanceDeadline"
              value={config.attendanceDeadline ? config.attendanceDeadline.slice(0, 16) : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !config.id}
            className={`w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl shadow-lg transition-all duration-150 flex items-center justify-center gap-2 text-lg ${(!config.id || saving) && 'opacity-50 cursor-not-allowed'}`}
          >
            {saving ? (
              <>
                <span className="animate-spin">&#9696;</span> Guardando...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" /></svg>
                Guardar cambios
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
