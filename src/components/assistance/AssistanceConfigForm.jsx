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
    <div className="asist-config-panel max-w-xl mx-auto p-8 mt-10">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
      .asist-config-panel {
        background: #f0e1ac;
        border: 6px solid #b6a077;
        border-radius: 28px;
        box-shadow: 0 0 32px #0006, 0 4px 22px #c1b06e55;
        font-family: 'Pirata One', cursive, monospace;
        position: relative;
      }
      .asist-title {
        font-size: 1.7rem;
        color: #5e461a;
        text-shadow: 1px 2px #fff9d6, 2px 5px 16px #b6a07788;
        letter-spacing: 1.2px;
        font-family: 'Pirata One', cursive;
        margin-bottom: 1.8rem;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .asist-label {
        font-weight: bold;
        color: #7a5c20;
        margin-bottom: 0.18rem;
        font-size: 1.03rem;
        font-family: 'Pirata One', cursive;
      }
      .asist-input {
        width: 100%;
        padding: 11px 13px;
        border-radius: 12px;
        background: #f7f1d6;
        border: 2.5px solid #cfb267;
        margin-bottom: 0.5rem;
        font-size: 1.08rem;
        color: #715f3a;
        font-family: 'Pirata One', cursive;
        box-shadow: 1px 2px #efe6c888;
        transition: border .15s;
      }
      .asist-input:focus {
        border-color: #715f3a;
        outline: none;
        background: #fffbe6;
      }
      .asist-btn {
        width: 100%;
        margin-top: 1.6rem;
        background: linear-gradient(90deg, #64a6ed 30%, #4687d2 100%);
        color: #fffbea;
        font-weight: bold;
        font-size: 1.13rem;
        font-family: 'Pirata One', cursive;
        border: none;
        border-radius: 19px;
        padding: 13px 0;
        box-shadow: 0 2px 12px #9ed0ff44;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 13px;
        transition: background .15s, opacity .14s;
        cursor: pointer;
      }
      .asist-btn:active { background: #2563eb; }
      .asist-btn:disabled, .asist-btn[aria-disabled="true"] {
        opacity: 0.54;
        cursor: not-allowed;
      }
      .asist-grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.1rem;
      }
    `}</style>

      <h2 className="asist-title">
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
            <label className="asist-label">Hora de entrada (inicio)</label>
            <input
              type="time"
              name="startEntryTime"
              value={config.startEntryTime || ""}
              onChange={handleChange}
              required
              className="asist-input"
            />
          </div>
          <div>
            <label className="asist-label">Hora de entrada (fin)</label>
            <input
              type="time"
              name="endEntryTime"
              value={config.endEntryTime || ""}
              onChange={handleChange}
              required
              className="asist-input"
            />
          </div>
          <div className="asist-grid2">
            <div>
              <label className="asist-label">Hora de salida (inicio)</label>
              <input
                type="time"
                name="startExitTime"
                value={config.startExitTime || ""}
                onChange={handleChange}
                required
                className="asist-input"
              />
            </div>
            <div>
              <label className="asist-label">Hora de salida (fin)</label>
              <input
                type="time"
                name="endExitTime"
                value={config.endExitTime || ""}
                onChange={handleChange}
                required
                className="asist-input"
              />
            </div>
          </div>
          <div>
            <label className="asist-label">Límite edición registros</label>
            <input
              type="datetime-local"
              name="attendanceDeadline"
              value={config.attendanceDeadline ? config.attendanceDeadline.slice(0, 16) : ""}
              onChange={handleChange}
              className="asist-input"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !config.id}
            className={`asist-btn ${(!config.id || saving) ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={!config.id || saving}
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
