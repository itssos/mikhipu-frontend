// /src/components/assistance/AssistancePage.js
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
    <div className="w-full mx-auto p-4 bg-white rounded-2xl shadow-xl">
      {/* Título principal de la página */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Asistencia</h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-t-2xl font-medium transition-all
              ${tab === t.key
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                : "bg-transparent text-gray-500 hover:text-blue-600"
              }`}
          >
            {/* Aquí se muestra el título del tab */}
            {t.title}
          </button>
        ))}
      </div>

      {/* Contenido de cada tab */}
      <div className="min-h-[300px]">
        {tab === "qr" && (
          <div>
            <StudentQrScanner></StudentQrScanner>
          </div>
        )}
        {tab === "config" && (
          <div>
            <AssistanceConfigForm></AssistanceConfigForm>
          </div>
        )}
        {tab === "records" && (
          <div>
            <AssistanceRecordsList />
          </div>
        )}
        {tab === "stats" && (
          <div>
            <AssistanceStatsDashboard />
          </div>
        )}
        {tab === "manual" && (
          <div>
            <ManualAssistanceTable />
          </div>
        )}
      </div>
    </div>
  );
}
