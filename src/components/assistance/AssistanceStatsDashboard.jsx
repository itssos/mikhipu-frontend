import React, { useRef } from "react";
import { getAssistanceStatistics } from "../../api/assistance";
import AssistanceFilterFetcher from "./AssistanceFilterFetcher";
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
    <div className="adventure-panel adventure-stats mx-auto mt-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
        .adventure-panel.adventure-stats {
          background: #b6a077 url('https://www.transparenttextures.com/patterns/wood-pattern.png');
          border: 7px solid #574d32;
          border-radius: 28px 28px 40px 40px;
          box-shadow: 0 0 32px #000b;
          padding: 36px 26px 28px 26px;
          font-family: 'Pirata One', cursive, monospace;
          max-width: 1200px;
        }
        .adventure-stats-title {
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 2.1rem;
          color: #fffbe0;
          font-family: 'Pirata One', cursive;
          letter-spacing: 2px;
          font-weight: bold;
          text-shadow: 1px 2px #433416, 2px 4px 8px #79631c;
          margin-bottom: 32px;
          background: linear-gradient(90deg, #a87e42 0%, #d1ba6b 100%);
          border-radius: 19px;
          border-bottom: 5px solid #69532a;
          padding: 12px 20px 12px 18px;
        }
        .adventure-panel .table-wood {
          border-radius: 19px;
          overflow: hidden;
          background: #ffeecb url('https://www.transparenttextures.com/patterns/wood-pattern.png');
          box-shadow: 0 2px 18px #b59d6a45;
          border: 3px solid #b0a16a;
        }
        .adventure-panel th, .adventure-panel td {
          font-family: 'Pirata One', cursive;
          font-size: 1.07rem;
        }
        .adventure-panel th {
          color: #554200;
          background: #f7e7bc;
        }
        .adventure-panel tr:nth-child(even) td {
          background: #f6eedc;
        }
        .adventure-panel tr:nth-child(odd) td {
          background: #fffbe0;
        }
        .adventure-panel .stats-btn {
          background: linear-gradient(120deg, #dac382 60%, #95702a 100%);
          border: 3px solid #604d18;
          border-radius: 11px 18px 11px 11px;
          font-family: 'Pirata One', cursive;
          font-size: 1.13rem;
          color: #3c2d0e;
          cursor: pointer;
          padding: 8px 18px 8px 16px;
          box-shadow: 2px 4px #b9a97e, 1px 1px 5px #4e3d10bb;
          margin-right: 10px;
          margin-bottom: 7px;
          transition: background 0.1s, color 0.1s, transform 0.1s;
          text-shadow: 1px 1px #fff7ad;
          outline: none;
        }
        .adventure-panel .stats-btn:active {
          background: #a38a47;
          color: #fff5b6;
          transform: scale(0.98);
        }
        .adventure-panel .charts-row {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 900px) {
          .adventure-panel .charts-row {
            flex-direction: row;
          }
        }
        .adventure-panel .chart-box {
          background: #eff6ff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(24, 63, 140, 0.13);
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 550px;
          height: 340px;
          margin: 0 auto;
          box-sizing: border-box;
        }
        .adventure-panel .chart-box.pie {
          max-width: 370px;
          align-items: center;
          justify-content: center;
        }
        .adventure-panel .chart-title {
          font-size: 1.15rem;
          font-weight: bold;
          margin-bottom: 1rem;
          color: #2563eb;
          text-align: center;
          font-family: 'Pirata One', cursive;
        }
        .adventure-panel .chart-container {
          width: 100%;
          height: 100%;
          flex: 1;
        }
        .adventure-panel .adventure-paginator button {
          background: linear-gradient(120deg, #e8e1a8 60%, #b59d6a 100%);
          color: #6c5626;
          border-radius: 9px;
          border: 2px solid #cfb44b;
          font-family: 'Pirata One', cursive;
          padding: 5px 14px;
          margin: 0 6px;
          font-size: 1rem;
          transition: background .12s, color .13s, transform .1s;
        }
        .adventure-panel .adventure-paginator button:active {
          background: #a39354;
          color: #fffbe0;
        }
        .adventure-panel .adventure-paginator span {
          font-size: 1.07rem;
          color: #745d24;
          font-family: 'Pirata One', cursive;
        }
      `}</style>

      <h2 className="adventure-stats-title">
        <svg width={34} height={34} fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24"><path d="M3 3v18h18M3 17l6-6 4 4 8-8" /></svg>
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
            const response = await fetch("/estadisticas_plantilla.xlsx");
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: "array" });
            const wsName = "Datos";
            const ws = workbook.Sheets[wsName];

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
              <div className="flex flex-col md:flex-row justify-end items-center mb-7 gap-3">
                <button
                  onClick={handleExportExcel}
                  className="stats-btn flex items-center gap-2"
                >
                  Exportar Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="stats-btn bg-gradient-to-br from-red-400 via-red-500 to-amber-300 hover:bg-red-700"
                  style={{
                    border: "3px solid #a63322"
                  }}
                >
                  Exportar PDF
                </button>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-400">
                  <span className="animate-spin inline-block mr-2">&#9696;</span>
                  Cargando estadísticas...
                </div>
              ) : error ? (
                <div className="py-12 text-center text-red-500">{error}</div>
              ) : stats.length === 0 ? (
                <div className="py-10 text-center text-gray-600">
                  No hay datos para los filtros seleccionados.
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto table-wood mb-8">
                    <table className="min-w-full bg-transparent text-sm">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 font-bold">Estudiante</th>
                          <th className="px-3 py-2 font-bold">Sesiones</th>
                          <th className="px-3 py-2 font-bold">Presente</th>
                          <th className="px-3 py-2 font-bold">Tardanza</th>
                          <th className="px-3 py-2 font-bold">Ausente</th>
                          <th className="px-3 py-2 font-bold">Salida Regular</th>
                          <th className="px-3 py-2 font-bold">Salida Anticipada</th>
                          <th className="px-3 py-2 font-bold">% Asistencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((s, i) => (
                          <tr key={s.studentId}>
                            <td className="px-3 py-2">{s.studentFullName}</td>
                            <td className="px-3 py-2 text-center">{s.totalSessions}</td>
                            <td className="px-3 py-2 text-center">{s.presentes}</td>
                            <td className="px-3 py-2 text-center">{s.tardanzas}</td>
                            <td className="px-3 py-2 text-center">{s.ausencias}</td>
                            <td className="px-3 py-2 text-center">{s.salidasRegulares}</td>
                            <td className="px-3 py-2 text-center">{s.salidasAnticipadas}</td>
                            <td className="px-3 py-2 text-center font-bold" style={{ color: "#2563eb" }}>{s.porcentajeAsistencia?.toFixed(2)}%</td>
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
                  </div>

                  {/* Paginador */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 adventure-paginator">
                      <button
                        onClick={() => onPageChange(filters.page - 1)}
                        disabled={filters.page === 0}
                      >Anterior</button>
                      <span>
                        Página {filters.page + 1} de {totalPages}
                      </span>
                      <button
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
