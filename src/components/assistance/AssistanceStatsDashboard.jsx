import React, { useRef } from "react";
import { getAssistanceStatistics } from "../../api/assistance";
import AssistanceFilterFetcher from "./AssistanceFilterFetcher"; // Asegúrate de importar el fetcher
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { exportAssistanceStatsPDF } from "../../utils/exportAssistanceStatsPDF";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = [
  "#2563eb", "#f59e42", "#ef4444", "#22c55e", "#a21caf", "#eab308", "#f87171"
];


export default function AssistanceStatsDashboard() {



  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <svg width={30} height={30} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M3 3v18h18M3 17l6-6 4 4 8-8" /></svg>
        Estadísticas de Asistencia
      </h2>
      <AssistanceFilterFetcher fetchFunction={getAssistanceStatistics}>
        {({
          content: stats,
          filters,
          loading,
          error,
          totalPages,
          totalElements,
          onPageChange,
          refetch,
        }) => {
          // PieChart Logic
          let pieData = [];
          if (stats.length > 1) {
            let presentes = 0, tardanzas = 0, ausencias = 0;
            stats.forEach(s => {
              presentes += s.presentes || 0;
              tardanzas += s.tardanzas || 0;
              ausencias += s.ausencias || 0;
            });
            pieData = [
              { name: "Asistencias", value: presentes },
              { name: "Tardanzas", value: tardanzas },
              { name: "Faltas", value: ausencias }
            ];
          } else if (stats.length === 1) {
            const s = stats[0];
            pieData = [
              { name: "Asistencias", value: s.presentes || 0 },
              { name: "Tardanzas", value: s.tardanzas || 0 },
              { name: "Faltas", value: s.ausencias || 0 }
            ];
          }

          const handleExportExcel = async () => {
            if (!stats || stats.length === 0) {
              alert("No hay datos para exportar.");
              return;
            }

            // 1. Cargar la plantilla
            const response = await fetch("/estadisticas_plantilla.xlsx");
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });

            // 2. Hoja donde pondrás los datos
            const wsName = "Datos";
            const ws = workbook.Sheets[wsName];

            // 3. Tabla para gráfico de barras (A1:H...)
            const headers = [
              "Estudiante", "Sesiones", "Presente", "Tardanza", "Ausente", "Salida Regular", "Salida Anticipada", "% Asistencia"
            ];
            const tableRows = stats.map(s => [
              s.studentFullName,
              s.totalSessions,
              s.presentes,
              s.tardanzas,
              s.ausencias,
              s.salidasRegulares,
              s.salidasAnticipadas,
              s.porcentajeAsistencia?.toFixed(2)
            ]);
            XLSX.utils.sheet_add_aoa(ws, [headers, ...tableRows], { origin: "A1" });

            // 4. Datos para gráfico pastel (K2:L4)
            let presentes = 0, tardanzas = 0, ausencias = 0;
            stats.forEach(s => {
              presentes += s.presentes || 0;
              tardanzas += s.tardanzas || 0;
              ausencias += s.ausencias || 0;
            });
            const pieChartData = [
              ["Tipo", "Cantidad"],
              ["Presente", presentes],
              ["Tardanza", tardanzas],
              ["Ausente", ausencias]
            ];
            XLSX.utils.sheet_add_aoa(ws, pieChartData, { origin: "K2" });

            // 5. Guardar y descargar
            const wbout = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
            saveAs(new Blob([wbout], { type: "application/octet-stream" }), "estadisticas-asistencia.xlsx");
          };

          const barRef = useRef();
          const pieRef = useRef();

          const handleExportPDF = () => {
            exportAssistanceStatsPDF({
              stats,
              barChartRef: barRef,
              pieChartRef: pieRef
            });
          };



          return (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition font-bold"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2m4-10v12m0 0l-4-4m4 4l4-4" /></svg>
                  Exportar Excel
                </button>
                <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-xl">
                  Exportar PDF
                </button>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-400">
                  <span className="animate-spin inline-block mr-2">&#9696;</span>
                  Cargando estadísticas...
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-500">
                  {error}
                </div>
              ) : stats.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  No hay datos para los filtros seleccionados.
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto rounded-xl border border-gray-100 shadow mb-8">
                    <table className="min-w-full bg-white text-sm">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-3 py-2 font-bold text-gray-700">Estudiante</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Sesiones</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Presente</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Tardanza</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Ausente</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Salida Regular</th>
                          <th className="px-3 py-2 font-bold text-gray-700">Salida Anticipada</th>
                          <th className="px-3 py-2 font-bold text-gray-700">% Asistencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((s, i) => (
                          <tr key={s.studentId} className={i % 2 === 0 ? "bg-white" : "bg-blue-50/30"}>
                            <td className="px-3 py-2">{s.studentFullName}</td>
                            <td className="px-3 py-2 text-center">{s.totalSessions}</td>
                            <td className="px-3 py-2 text-center">{s.presentes}</td>
                            <td className="px-3 py-2 text-center">{s.tardanzas}</td>
                            <td className="px-3 py-2 text-center">{s.ausencias}</td>
                            <td className="px-3 py-2 text-center">{s.salidasRegulares}</td>
                            <td className="px-3 py-2 text-center">{s.salidasAnticipadas}</td>
                            <td className="px-3 py-2 text-center font-bold text-blue-700">{s.porcentajeAsistencia?.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Gráficos */}
                  <div className="charts-row">
                    <div className="chart-box" ref={barRef}>
                      <h3 className="chart-title">Asistencia General</h3>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats}
                            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="studentFullName" fontSize={12} angle={-12} interval={0} height={60} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="presentes" name="Presente" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
                            <Bar dataKey="tardanzas" name="Tardanza" fill={COLORS[1]} radius={[8, 8, 0, 0]} />
                            <Bar dataKey="ausencias" name="Ausente" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    {/* Pie */}
                    <div className="chart-box pie" ref={pieRef}>
                      <h3 className="chart-title">
                        {stats.length > 1 ? "Totales (Todos los estudiantes)" : stats[0]?.studentFullName}
                      </h3>
                      <div className="chart-container">
                        <ResponsiveContainer width="100%" height="85%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({ name, percent, value }) =>
                                `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                              }
                            >
                              {pieData.map((entry, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value, name, props) => [`${value} (${((value / pieData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`, name]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <style>{`
                      .charts-row {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                        align-items: center;
                        justify-content: center;
                      }
                      @media (min-width: 768px) {
                        .charts-row {
                          flex-direction: row;
                        }
                      }
                      .chart-box {
                        background: #eff6ff;
                        border-radius: 16px;
                        padding: 1.5rem;
                        box-shadow: 0 2px 12px rgba(24, 63, 140, 0.10);
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        max-width: 550px;
                        height: 340px;
                        margin: 0 auto;
                        box-sizing: border-box;
                      }
                      .chart-box.pie {
                        max-width: 400px;
                        align-items: center;
                        justify-content: center;
                      }
                      .chart-title {
                        font-size: 1.25rem;
                        font-weight: bold;
                        margin-bottom: 1rem;
                        color: #2563eb;
                        text-align: center;
                      }
                      .chart-container {
                        width: 100%;
                        height: 100%;
                        flex: 1;
                        /* For recharts ResponsiveContainer */
                      }
                    `}</style>
                  </div>

                  {/* Paginador */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-300 text-blue-800"
                        onClick={() => onPageChange(filters.page - 1)}
                        disabled={filters.page === 0}
                      >Anterior</button>
                      <span className="font-semibold">
                        Página {filters.page + 1} de {totalPages}
                      </span>
                      <button
                        className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-300 text-blue-800"
                        onClick={() => onPageChange(filters.page + 1)}
                        disabled={filters.page >= totalPages - 1}
                      >Siguiente</button>
                    </div>
                  )}
                </div>
              )}
            </>
          );
        }}
      </AssistanceFilterFetcher>
    </div>
  );
}
