// src/utils/exportAssistanceStatsPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export async function exportAssistanceStatsPDF({
  stats = [],
  pieChartRef, // ref a tu <canvas> del gráfico pastel
  barChartRef // ref a tu <canvas> del gráfico barras
}) {
  if (!stats || stats.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  // 1. Crea documento
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4"
  });

  // 2. Título
  doc.setFontSize(22);
  doc.text("Estadísticas de Asistencia", 40, 50);

  // 3. Tabla
  const tableRows = stats.map(s => [
    s.studentFullName,
    s.totalSessions,
    s.presentes,
    s.tardanzas,
    s.ausencias,
    s.salidasRegulares,
    s.salidasAnticipadas,
    `${s.porcentajeAsistencia?.toFixed(2)}%`
  ]);
  autoTable(doc, {
    head: [[
      "Estudiante", "Sesiones", "Presente", "Tardanza", "Ausente", "Salida Regular", "Salida Anticipada", "% Asistencia"
    ]],
    body: tableRows,
    startY: 70,
    styles: { fontSize: 10 }
  });

  // 4. Espacio para gráficos
  let y = doc.lastAutoTable.finalY + 30;

  // 5. Gráfico de barras (si tienes ref)
  if (barChartRef?.current) {
    const barCanvas = barChartRef.current;
    const barImg = await html2canvas(barCanvas, { backgroundColor: null }).then(canvas => canvas.toDataURL("image/png"));
    doc.setFontSize(14);
    doc.text("Gráfico de Barras", 40, y);
    doc.addImage(barImg, "PNG", 40, y + 10, 420, 180, undefined, "FAST");
    y += 210;
  }

  // 6. Gráfico de pastel (si tienes ref)
  if (pieChartRef?.current) {
    const pieCanvas = pieChartRef.current;
    const pieImg = await html2canvas(pieCanvas, { backgroundColor: null }).then(canvas => canvas.toDataURL("image/png"));
    doc.setFontSize(14);
    doc.text("Gráfico de Pastel", 480, y - 210 + 20); // Ajusta la posición según tu layout
    doc.addImage(pieImg, "PNG", 480, y - 210 + 30, 220, 180, undefined, "FAST");
  }

  // 7. Descarga PDF
  doc.save("estadisticas-asistencia.pdf");
}
