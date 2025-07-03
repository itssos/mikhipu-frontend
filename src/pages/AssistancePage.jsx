import React, { useState } from "react";
import AssistanceConfigForm from "../components/assistance/AssistanceConfigForm"
import StudentQrScanner from "../components/student/StudentQRScanner"
import AssistanceRecordsList from "../components/assistance/AssistanceRecordsList";
import AssistanceStatsDashboard from "../components/assistance/AssistanceStatsDashboard";
import ManualAssistanceTable from "../components/assistance/ManualAssistanceTable";

const TABS = [
  { key: "qr", title: "QR" },
  { key: "config", title: "Configuración" },
  { key: "records", title: "Registros" },
  { key: "stats", title: "Estadísticas" },
  { key: "manual", title: "Manual" }
];

export default function AssistancePage() {
  const [tab, setTab] = useState(TABS[0].key);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-10">
      <style>{`
    .adventure-panel.adventure-main-panel {
      border: 10px solid #574d32;
      border-radius: 28px 28px 40px 40px;
      box-shadow: 0 0 32px #000b;
      padding: 36px 32px 32px 32px;
      font-family: 'Pirata One', cursive, monospace;
      position: relative;
      background: #fef8e2;
      width: 100%;
      max-width: 100vw;
      min-height: 200px;
      box-sizing: border-box;
    }
    .adventure-tabs {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 1.4rem;
      border-bottom: 5px solid #8a7e56;
      overflow-x: auto;
      scrollbar-width: thin;
      scrollbar-color: #dac382 #fef8e2;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 2px;
      max-width: 100vw;
    }
    .adventure-tabs::-webkit-scrollbar {
      height: 5px;
      background: #fef8e2;
    }
    .adventure-tabs::-webkit-scrollbar-thumb {
      background: #dac382;
      border-radius: 4px;
    }
    .adventure-tab-btn {
      font-family: 'Pirata One', cursive;
      background: linear-gradient(90deg, #dac382 80%, #bca66a 100%);
      color: #66521d;
      border: none;
      border-bottom: 6px solid transparent;
      border-radius: 18px 18px 0 0;
      padding: 12px 34px 11px 34px;
      font-size: 1.18rem;
      letter-spacing: 1.5px;
      cursor: pointer;
      box-shadow: 0 3px 0 #b6a07755;
      transition: all 0.13s;
      margin-bottom: -4px;
      position: relative;
      white-space: nowrap;
      min-width: 85px;
    }
    .adventure-tab-btn.active, .adventure-tab-btn:hover {
      background: linear-gradient(90deg, #f4e3ab 90%, #dac382 100%);
      color: #2e2111;
      border-bottom: 6px solid #574d32;
      box-shadow: 0 5px 0 #e8d29055, 0 9px 16px #b3933255;
      z-index: 1;
    }
    .adventure-tab-btn:not(.active):hover {
      border-bottom: 6px solid #c9ad74;
    }
    .adventure-title-main {
      font-size: 2.15rem;
      color: #473314;
      font-family: 'Pirata One', cursive;
      text-shadow: 1px 2px #fff6d2, 2px 5px 16px #b6a07766;
      margin-bottom: 1.8rem;
      letter-spacing: 1.2px;
      word-break: break-word;
      text-align: center;
    }
    @media (max-width: 1020px) {
      .adventure-panel.adventure-main-panel { 
        padding: 18px 10px 16px 10px;
        border-width: 7px;
        border-radius: 20px 20px 30px 30px;
      }
      .adventure-title-main { font-size: 1.6rem; }
      .adventure-tab-btn { font-size: 1.02rem; padding: 9px 15px 8px 15px; }
    }
    @media (max-width: 720px) {
      .adventure-panel.adventure-main-panel { 
        padding: 10px 2px 7px 2px;
        border-width: 4px;
        border-radius: 13px 13px 20px 20px;
      }
      .adventure-title-main { font-size: 1.18rem; margin-bottom: 1.2rem;}
      .adventure-tabs { gap: 0.1rem; }
      .adventure-tab-btn { 
        font-size: 0.91rem;
        padding: 7px 9px 7px 9px;
        min-width: 62px;
        border-radius: 9px 9px 0 0;
      }
    }
    @media (max-width: 480px) {
      .adventure-title-main { font-size: 0.97rem; }
      .adventure-tab-btn { 
        font-size: 0.78rem; 
        padding: 5px 5px 5px 5px;
        min-width: 42px;
      }
      .adventure-panel.adventure-main-panel { border-width: 2px; }
    }
  `}</style>

      <h1 className="adventure-title-main">🗺️ Gestión de Asistencia</h1>

      {/* Tabs */}
      <div className="adventure-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`adventure-tab-btn${tab === t.key ? " active" : ""}`}
          >
            {t.title}
          </button>
        ))}
      </div>

      {/* Contenido de cada tab */}
      <div className="min-h-[300px]">
        {tab === "qr" && <StudentQrScanner />}
        {tab === "config" && <AssistanceConfigForm />}
        {tab === "records" && <AssistanceRecordsList />}
        {tab === "stats" && <AssistanceStatsDashboard />}
        {tab === "manual" && <ManualAssistanceTable />}
      </div>
    </div>
  );
}
