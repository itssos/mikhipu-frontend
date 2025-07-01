import React, { useState, useEffect } from 'react';
import {
  registerScore,
  getWeightedAverage,
  getMyScores,
  getMyChildrenScores,
  getScoresHistory,
} from '../api/scores';
import { getCourses } from '../api/courses';
import { filterEvaluations } from '../api/evaluation';
import { getStudents } from '../api/students';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../hooks/useAuth';
import useCan from '../hooks/useCan'
import useRol from '../hooks/useRol';
import Pagination from './UI/Pagination'
import StudentSelectByName from './student/StudentSelectByName';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import autoTable from "jspdf-autotable";

const QUARTERS = [
  { value: "PRIMER", label: "1er Trimestre" },
  { value: "SEGUNDO", label: "2do Trimestre" },
  { value: "TERCER", label: "3er Trimestre" },
  { value: "VERANO", label: "Verano" },
];



export default function ScoreManager() {
  const { user, person } = useAuth();

  const isEstudiante = useRol(['ESTUDIANTE'])
  const isApoderado = useRol(['APODERADO'])
  const isDocente = useRol(['DOCENTE'])

  const canRegister = useCan('SCORE_REGISTER')
  const canAverage = useCan('SCORE_AVERAGE_VIEW')
  const canSelf = useCan('SCORE_SELF_VIEW')
  const canChildren = useCan('SCORE_CHILDREN_VIEW')

  // States globales para selects
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  function handleDownloadPDF() {
    if (!historyScores?.content?.length) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Historial de Notas", 40, 40);

    const tableRows = historyScores.content.map(s => [
      s.studentFullName,
      s.courseName,
      s.evaluationName ?? s.evaluation?.name,
      s.value,
      new Date(s.createdAt).toLocaleString()
    ]);

    autoTable(doc, {
      head: [["Estudiante", "Curso", "Evaluación", "Nota", "Fecha"]],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 11 }
    });

    doc.save("historial_notas.pdf");
  }

  function handleDownloadExcel() {
    const ws = XLSX.utils.json_to_sheet(
      (historyScores?.content || []).map(s => ({
        "Estudiante": s.studentFullName,
        "Curso": s.courseName,
        "Evaluación": s.evaluationName ?? s.evaluation?.name,
        "Nota": s.value,
        "Fecha": new Date(s.createdAt).toLocaleString()
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historial");

    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "historial_notas.xlsx");
  }

  function handleDownloadMyScoresPDF() {
    if (!myScores?.length) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Mis Notas", 40, 40);

    const tableRows = myScores.map(s => [
      s.courseName ?? s.course?.name,
      s.evaluationName ?? s.evaluation?.name,
      s.value,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [["Curso", "Evaluación", "Nota", "Fecha"]],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 11 }
    });

    doc.save("mis_notas.pdf");
  }

  function handleDownloadMyScoresExcel() {
    if (!myScores?.length) {
      alert("No hay datos para exportar.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      myScores.map(s => ({
        "Curso": s.courseName ?? s.course?.name,
        "Evaluación": s.evaluationName ?? s.evaluation?.name,
        "Nota": s.value,
        "Fecha": new Date(s.createdAt).toLocaleDateString()
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mis Notas");

    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "mis_notas.xlsx");
  }

  function handleDownloadChildrenScoresPDF() {
    // Junta todos los scores en una sola lista
    const allScores = [];
    childrenScoresData?.content?.forEach(student => {
      student.scores.forEach(score => {
        allScores.push({
          studentFullName: student.studentFullName,
          courseName: score.courseName ?? score.course?.name,
          evaluationName: score.evaluationName ?? score.evaluation?.name,
          value: score.value,
          fecha: new Date(score.createdAt).toLocaleDateString()
        });
      });
    });

    if (!allScores.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Notas de mis hijos", 40, 40);

    const tableRows = allScores.map(s => [
      s.studentFullName,
      s.courseName,
      s.evaluationName,
      s.value,
      s.fecha
    ]);

    autoTable(doc, {
      head: [["Hijo", "Curso", "Evaluación", "Nota", "Fecha"]],
      body: tableRows,
      startY: 60,
      styles: { fontSize: 11 }
    });

    doc.save("notas_hijos.pdf");
  }

  function handleDownloadChildrenScoresExcel() {
    const allScores = [];
    childrenScoresData?.content?.forEach(student => {
      student.scores.forEach(score => {
        allScores.push({
          "Hijo": student.studentFullName,
          "Curso": score.courseName ?? score.course?.name,
          "Evaluación": score.evaluationName ?? score.evaluation?.name,
          "Nota": score.value,
          "Fecha": new Date(score.createdAt).toLocaleDateString()
        });
      });
    });

    if (!allScores.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(allScores);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas hijos");

    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "notas_hijos.xlsx");
  }

  // States para Registrar Nota
  const [registerForm, setRegisterForm] = useState({
    studentId: '',
    courseId: '',
    evaluationId: '',
    value: '',
    year: '',
    quarter: '',
  });

  // States para consultar promedio
  const [averageForm, setAverageForm] = useState({
    studentId: '',
    courseId: '',
    year: '',
    quarter: '',
  });
  const [average, setAverage] = useState(null);

  // States para ver mis notas/hijos/historial
  const [myScores, setMyScores] = useState([]);
  const [childrenScores, setChildrenScores] = useState([]);
  const [historyScores, setHistoryScores] = useState({
    content: [],
    totalPages: 1,
    number: 0,
    size: 20,
  });
  const [pageSize, setPageSize] = React.useState(20);

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    handleGetHistoryScores(0, newSize); // reinicia a la página 0 cuando cambias el size
  };



  // Filtros compartidos
  const [filter, setFilter] = useState({
    courseId: '',
    evaluationId: '',
    studentId: '',
    year: '',
    quarter: '',
  });

  const [loading, setLoading] = useState(false);

  const isAdminOrTeacher = useRol(['ADMINISTRADOR', 'DOCENTE']);

  // Carga cursos y estudiantes una sola vez
  useEffect(() => {
    getCourses().then(r => setCourses(r));
    if (isEstudiante && person?.dni) {
      getStudents({ dni: person.dni }).then(r => setStudents(r?.content));
    } else {
      getStudents().then(r => setStudents(r?.content));
    }
  }, [isEstudiante, person?.dni]);

  // Cuando cambia curso/año/trimestre, carga evaluaciones relacionadas
  useEffect(() => {
    if (registerForm.courseId && (registerForm.year || registerForm.quarter)) {
      filterEvaluations({
        courseId: Number(registerForm.courseId),
        year: registerForm.year,
        quarter: registerForm.quarter,
      }, 0, 20)
        .then(res => {
          setEvaluations(res?.content)
        });
    } else {
      setEvaluations([]);
    }
  }, [registerForm.courseId, registerForm.year, registerForm.quarter]);

  useEffect(() => {
  }, [evaluations]);


  // --- REGISTRAR NOTA ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerScore({
        studentId: Number(registerForm.studentId),
        evaluationId: Number(registerForm.evaluationId),
        value: Number(registerForm.value),
      });
      toast.success('Nota registrada');
      setRegisterForm(f => ({ ...f, value: '' }));
    } catch {
      toast.error('Error al registrar nota');
    }
    setLoading(false);
  };

  // --- PROMEDIO ---
  const handleGetAverage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getWeightedAverage({
        ...averageForm,
        studentId: Number(averageForm.studentId),
        courseId: Number(averageForm.courseId),
      });
      setAverage(res.data ?? res);
    } catch {
      toast.error('No se pudo obtener el promedio');
      setAverage(null);
    }
    setLoading(false);
  };

  // --- MIS NOTAS ---
  const handleGetMyScores = async () => {
    setLoading(true);
    try {
      const res = await getMyScores({
        courseId: filter.courseId ? Number(filter.courseId) : undefined,
        evaluationId: filter.evaluationId ? Number(filter.evaluationId) : undefined,
        year: filter.year || undefined,
        quarter: filter.quarter || undefined,
      }, 0, 10);
      console.log(res.content);

      setMyScores(res.content);
    } catch {
      toast.error('Error al consultar tus notas');
    }
    setLoading(false);
  };

  const [childrenScoresPage, setChildrenScoresPage] = React.useState(0);
  const [childrenScoresSize, setChildrenScoresSize] = React.useState(20);
  const [childrenScoresData, setChildrenScoresData] = React.useState({
    content: [],
    totalPages: 1,
    number: 0,
    size: 20,
  });

  // --- NOTAS HIJOS ---
  const handleGetChildrenScores = async (page = childrenScoresPage, size = childrenScoresSize) => {
    setLoading(true);
    try {
      const res = await getMyChildrenScores(
        {
          courseId: filter.courseId ? Number(filter.courseId) : undefined,
          evaluationId: filter.evaluationId ? Number(filter.evaluationId) : undefined,
          year: filter.year || undefined,
          quarter: filter.quarter || undefined,
        },
        page,
        size
      );
      setChildrenScoresData(res);
      setChildrenScoresPage(page);
      setChildrenScoresSize(size);
    } catch {
      toast.error('Error al consultar notas de tus hijos');
    }
    setLoading(false);
  };

  // --- HISTORIAL GENERAL (solo ADMIN/DOCENTE) ---
  const handleGetHistoryScores = async (pagina = 0, size = pageSize) => {
    setLoading(true);
    try {
      const res = await getScoresHistory(
        {
          studentId: filter.studentId ? Number(filter.studentId) : undefined,
          courseId: filter.courseId ? Number(filter.courseId) : undefined,
          evaluationId: filter.evaluationId ? Number(filter.evaluationId) : undefined,
          year: filter.year || undefined,
          quarter: filter.quarter || undefined,
        },
        Number(pagina),
        size
      );
      setHistoryScores(res);
    } catch {
      toast.error('Error al consultar historial');
    }
    setLoading(false);
  };



  // --- UI ---
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white/90 rounded-2xl shadow-xl mt-8 panel-adventure">
      <ToastContainer position="top-right" autoClose={1700} hideProgressBar />
      <h2 className="adventure-title">Gestión de Calificaciones</h2>

      {/* REGISTRAR NOTA */}
      {(canRegister && isDocente) && (
        <section className="mb-8 bg-blue-50 rounded-xl p-4 shadow space-y-3">
          <h3 className="font-semibold text-blue-900">Registrar Nota</h3>
          <form className="flex gap-4 flex-wrap items-end" onSubmit={handleRegister}>
            <div>
              <label className="block text-xs">Estudiante</label>
              <select
                value={registerForm.studentId}
                onChange={e => setRegisterForm(f => ({ ...f, studentId: e.target.value }))}
                className="rounded-lg border p-2"
                required
              >
                <option value="">Seleccione...</option>
                {students.map(stu => (
                  <option key={stu.id} value={stu.id}>{stu.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs">Curso</label>
              <select
                value={registerForm.courseId}
                onChange={e => {
                  setRegisterForm(f => ({ ...f, courseId: e.target.value }));
                  setRegisterForm(f => ({ ...f, evaluationId: '' }));
                }}
                className="rounded-lg border p-2"
                required
              >
                <option value="">Seleccione...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs">Trimestre</label>
              <select
                value={registerForm.quarter}
                onChange={e => setRegisterForm(f => ({ ...f, quarter: e.target.value }))}
                className="rounded-lg border p-2"
              >
                <option value="">Todos</option>
                {QUARTERS.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs">Año</label>
              <input
                type="number"
                placeholder="Año"
                value={registerForm.year}
                onChange={e => setRegisterForm(f => ({ ...f, year: e.target.value }))}
                className="rounded-lg border p-2 w-24"
              />
            </div>
            <div>
              <label className="block text-xs">Evaluación</label>
              <select
                value={registerForm.evaluationId}
                onChange={e => setRegisterForm(f => ({ ...f, evaluationId: e.target.value }))}
                className="rounded-lg border p-2"
                required
              >
                <option value="">Seleccione...</option>
                {evaluations
                  .map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name} ({ev.type})</option>
                  ))}
              </select>
            </div>
            <input
              type="number"
              placeholder="Nota"
              value={registerForm.value}
              onChange={e => setRegisterForm(f => ({ ...f, value: e.target.value }))}
              className="rounded-lg border p-2 w-28"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              disabled={loading}
            >
              Registrar
            </button>
          </form>
        </section>
      )}

      {/* PROMEDIO */}
      {canAverage && (
        <section
          className="panel-adventure mb-10"
          style={{
            marginBottom: 36,
            minHeight: 0,
            fontFamily: "'Pirata One', cursive, serif",
            borderRadius: 22,
            border: "5px solid #487746",
            boxShadow: "0 4px 22px #48774638",
            background: "#e8f5d2 url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
            padding: "32px 22px 22px 22px",
            color: "#25412a",
            position: "relative",
          }}
        >
          <h3
            style={{
              fontSize: 27,
              letterSpacing: 1.5,
              color: "#34703a",
              textShadow: "1.5px 2px #fffbe6, 0 2px #ad9c62",
              marginBottom: 16,
            }}
          >
            🧮 Consultar Promedio Ponderado
          </h3>
          <form
            className="flex gap-4 flex-wrap items-end"
            style={{ marginBottom: 8 }}
            onSubmit={handleGetAverage}
          >
            <div>
              {/* Usa el mismo estilo para tu StudentSelectByName si puedes! */}
              <StudentSelectByName
                students={students}
                value={averageForm.studentId}
                onChange={e =>
                  setAverageForm(f => ({ ...f, studentId: e.target.value }))
                }
                className="adventure-select"
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#527c48" }}>Curso</label>
              <select
                value={averageForm.courseId}
                onChange={e =>
                  setAverageForm(f => ({ ...f, courseId: e.target.value }))
                }
                className="adventure-select"
                required
              >
                <option value="">Seleccione...</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#527c48" }}>Trimestre</label>
              <select
                value={averageForm.quarter}
                onChange={e =>
                  setAverageForm(f => ({ ...f, quarter: e.target.value }))
                }
                className="adventure-select"
              >
                <option value="">Todos</option>
                {QUARTERS.map(q => (
                  <option key={q.value} value={q.value}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#527c48" }}>Año</label>
              <input
                type="number"
                placeholder="Año"
                value={averageForm.year}
                onChange={e =>
                  setAverageForm(f => ({ ...f, year: e.target.value }))
                }
                className="adventure-select"
                style={{ width: 72 }}
              />
            </div>
            <button
              type="submit"
              className="btn-adventure"
              style={{
                background: "linear-gradient(120deg, #7dde9d 60%, #39a857 100%)",
                color: "white",
                border: "3px solid #329047",
                fontFamily: "'Pirata One', cursive",
                fontSize: 17,
                padding: "9px 17px",
                borderRadius: 11,
                marginLeft: 10,
                boxShadow: "0 1.5px 6px #32904715",
                transition: "all 0.14s",
              }}
              disabled={loading}
            >
              Consultar
            </button>
          </form>
          {average !== null && (
            <div
              className="font-bold text-xl mt-2"
              style={{
                color: "#2a7437",
                background:
                  "linear-gradient(90deg, #c8f6be 60%, #e3ffe7 100%)",
                padding: "14px 22px",
                borderRadius: 13,
                border: "2.5px solid #4fa94c",
                boxShadow: "0 3px 9px #b7eeac31",
                fontFamily: "'Press Start 2P', 'Pirata One', cursive",
                letterSpacing: 1,
              }}
            >
              <span role="img" aria-label="medalla">
                🏅
              </span>{" "}
              Promedio: <span style={{ fontSize: 22 }}>{average}</span>
            </div>
          )}
        </section>
      )}


      {/* MIS NOTAS */}
      {(canSelf && isEstudiante) && (
        <section
          className="panel-adventure mb-10"
          style={{
            marginBottom: 36,
            fontFamily: "'Pirata One', cursive, serif",
            minHeight: 0,
            borderRadius: 22,
            border: "5px solid #715f3a",
            boxShadow: "0 4px 22px #614e2a38",
            background: "#ede2c3 url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
            padding: "36px 22px 28px 22px",
            color: "#3d3219",
            position: "relative",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <h3
              style={{
                fontSize: 28,
                letterSpacing: 1.5,
                color: "#604d18",
                textShadow: "1.5px 2px #fffbe6, 0 2px #ad9c62",
              }}
            >
              📜 Mis Notas
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadMyScoresPDF}
                className="btn-adventure danger"
                style={{
                  background: "linear-gradient(120deg, #ff7e6e 60%, #a13a28 100%)",
                  color: "white",
                  border: "3px solid #a13a28",
                  fontFamily: "'Pirata One', cursive",
                  fontSize: 17,
                  padding: "9px 17px",
                  borderRadius: 11,
                  marginRight: 2,
                  boxShadow: "0 1.5px 6px #a13a2815",
                  transition: "all 0.14s"
                }}
              >
                📄 Descargar PDF
              </button>
              <button
                onClick={handleDownloadMyScoresExcel}
                className="btn-adventure"
                style={{
                  background: "linear-gradient(120deg, #70bb7a 60%, #399b4b 100%)",
                  color: "white",
                  border: "3px solid #2e8241",
                  fontFamily: "'Pirata One', cursive",
                  fontSize: 17,
                  padding: "9px 17px",
                  borderRadius: 11,
                  boxShadow: "0 1.5px 6px #399b4b15",
                  transition: "all 0.14s"
                }}
              >
                📊 Descargar Excel
              </button>
            </div>
          </div>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-3 items-end">
            <div>
              <label style={{ fontSize: 13, color: "#997e5c" }}>Curso</label>
              <select
                value={filter.courseId}
                onChange={e => setFilter(f => ({ ...f, courseId: e.target.value }))}
                className="adventure-select"
              >
                <option value="">Todos</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#997e5c" }}>Trimestre</label>
              <select
                value={filter.quarter}
                onChange={e => setFilter(f => ({ ...f, quarter: e.target.value }))}
                className="adventure-select"
              >
                <option value="">Todos</option>
                {QUARTERS.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: "#997e5c" }}>Año</label>
              <input
                type="number"
                placeholder="Año"
                value={filter.year}
                onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
                className="adventure-select"
                style={{ width: 72 }}
              />
            </div>
            <button
              onClick={handleGetMyScores}
              className="btn-adventure"
              style={{
                background: "linear-gradient(120deg, #8b72ce 60%, #553591 100%)",
                color: "white",
                border: "3px solid #5e4696",
                fontFamily: "'Pirata One', cursive",
                fontSize: 17,
                padding: "9px 17px",
                borderRadius: 11,
                marginLeft: 10,
                boxShadow: "0 1.5px 6px #5e469615",
                transition: "all 0.14s"
              }}
              disabled={loading}
            >
              Consultar
            </button>
          </div>
          {/* Tabla */}
          <div className="overflow-x-auto rounded-2xl shadow mt-3">
            <table
              className="adventure-table"
              style={{
                width: "100%",
                fontSize: 15,
                fontFamily: "'Pirata One', cursive",
                background: "#fffbe6",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <thead>
                <tr style={{
                  background: "linear-gradient(90deg, #e5d0ff 60%, #c9b6f5 100%)",
                  color: "#462669"
                }}>
                  <th className="p-2">Curso</th>
                  <th className="p-2">Evaluación</th>
                  <th className="p-2">Nota</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {myScores.map(s => (
                  <tr key={s.id} style={{ borderBottom: "1.5px solid #e7dac2" }}>
                    <td className="p-2">{s.courseName ?? s.course?.name}</td>
                    <td className="p-2">{s.evaluationName ?? s.evaluation?.name}</td>
                    <td className="p-2">{s.value}</td>
                    <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <style>{`
          .btn-adventure {
  background: linear-gradient(120deg, #dac382 60%, #95702a 100%);
  border: 3px solid #604d18;
  border-radius: 13px 20px 13px 13px;
  font-family: 'Pirata One', cursive;
  font-size: 17px;
  color: #3c2d0e;
  cursor: pointer;
  padding: 9px 16px;
  box-shadow: 2px 4px #b9a97e, 1px 1px 5px #4e3d10bb;
  margin-right: 6px;
  margin-bottom: 2px;
  text-shadow: 1px 1px #fff7ad;
  outline: none;
  transition: all 0.13s;
}
.btn-adventure:hover {
  background: #ffecc5 !important;
  color: #a2782d !important;
  transform: scale(1.05);
}
.btn-adventure:active {
  background: #a38a47 !important;
  color: #fff5b6 !important;
}

.adventure-select {
  border-radius: 10px;
  border: 2px solid #ad9c62;
  background: #f6ecd1;
  font-family: 'Pirata One', cursive;
  font-size: 16px;
  color: #5c430f;
  padding: 8px 12px;
  margin-right: 3px;
  outline: none;
  box-shadow: 1.5px 2.5px #ccb97b;
  transition: border 0.12s;
}
.adventure-select:focus {
  border: 2.5px solid #604d18;
  background: #fffbe6;
}
.adventure-table th, .adventure-table td {
  padding: 10px 8px;
  border-bottom: 1.3px solid #e2d3b3;
}

          `}</style>
        </section>
      )}

      {/* NOTAS DE HIJOS */}
      {(canChildren && isApoderado) && (
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow space-y-3">
          <div className='flex justify-between flex-col md:flex-row'>
            <h3 className="font-semibold text-pink-900">Notas de mis hijos</h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleDownloadChildrenScoresPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Descargar PDF
              </button>
              <button
                onClick={handleDownloadChildrenScoresExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Descargar Excel
              </button>
            </div>
          </div>
          <div className="flex gap-3 mb-2">
            <div>
              <label className="block text-xs">Curso</label>
              <select
                value={filter.courseId}
                onChange={e => setFilter(f => ({ ...f, courseId: e.target.value }))}
                className="rounded-lg border p-2"
              >
                <option value="">Todos</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs">Trimestre</label>
              <select
                value={filter.quarter}
                onChange={e => setFilter(f => ({ ...f, quarter: e.target.value }))}
                className="rounded-lg border p-2"
              >
                <option value="">Todos</option>
                {QUARTERS.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs">Año</label>
              <input
                type="number"
                placeholder="Año"
                value={filter.year}
                onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
                className="rounded-lg border p-2 w-24"
              />
            </div>
            <button
              onClick={() => handleGetChildrenScores(0, childrenScoresSize)}
              className="bg-pink-600 text-white px-4 h-10 self-end rounded-xl hover:bg-pink-700"
              disabled={loading}
            >
              Consultar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-pink-100">
                  <th className="p-2">Hijo</th>
                  <th className="p-2">Curso</th>
                  <th className="p-2">Evaluación</th>
                  <th className="p-2">Nota</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {childrenScoresData?.content?.map(student => (
                  student.scores.map(score => (
                    <tr key={score.id}>
                      <td className="p-2">{student.studentFullName}</td>
                      <td className="p-2">{score.evaluationName}</td>
                      <td className="p-2">{score.evaluationWeight}%</td>
                      <td className="p-2">{score.value}</td>
                      <td className="p-2">{new Date(score.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
            <Pagination
              page={childrenScoresData.number}
              totalPages={childrenScoresData.totalPages}
              onChangePage={page => handleGetChildrenScores(page, childrenScoresSize)}
            />

          </div>
        </section>
      )}

      {isAdminOrTeacher && (
        <section className="adventure-panel adventure-history mb-10">
          <style>{`
      .adventure-panel.adventure-history {
        background: #f7f1e2 url('https://www.transparenttextures.com/patterns/wood-pattern.png');
        border: 7px solid #574d32;
        border-radius: 26px 26px 35px 35px;
        box-shadow: 0 0 22px #000a;
        font-family: 'Pirata One', cursive, monospace;
        padding: 28px 28px 22px 28px;
      }
      .adventure-panel .adventure-title {
        font-size: 1.45rem;
        color: #6c5222;
        text-shadow: 1px 2px #fff6d2, 1px 5px 10px #b6a07744;
        margin-bottom: 0.3rem;
        font-family: 'Pirata One', cursive;
      }
      .adventure-panel .adventure-btn {
        font-family: 'Pirata One', cursive;
        font-size: 1.06rem;
        border-radius: 14px;
        border: 2.2px solid #ae9457;
        background: linear-gradient(120deg, #dac382 60%, #95702a 100%);
        color: #433212;
        padding: 8px 22px;
        margin-right: 5px;
        margin-bottom: 3px;
        box-shadow: 2px 2px 0 #cbb990, 2px 7px 15px #b3933266;
        transition: background 0.11s, color 0.11s, transform 0.10s;
        outline: none;
      }
      .adventure-panel .adventure-btn:active {
        background: #95702a;
        color: #fff7cd;
        transform: scale(.97);
      }
      .adventure-panel .adventure-btn.red {
        background: linear-gradient(120deg, #e54e3e 50%, #d42a2a 100%);
        color: #fff6e8;
        border: 2px solid #b72b1a;
        box-shadow: 2px 2px 0 #cbb990, 2px 7px 15px #cc656666;
      }
      .adventure-panel .adventure-btn.red:active {
        background: #a52c1c;
        color: #fff9ef;
      }
      .adventure-panel .adventure-btn.green {
        background: linear-gradient(120deg, #57d651 50%, #20901c 100%);
        color: #fff;
        border: 2px solid #1e7622;
      }
      .adventure-panel .adventure-btn.green:active {
        background: #125d1a;
        color: #fff;
      }
      .adventure-panel .adventure-table {
        width: 100%;
        font-family: 'Pirata One', cursive;
        background: #fffbe9;
        border-radius: 15px;
        box-shadow: 0 2px 18px #c8ad7944;
        overflow: hidden;
        margin-top: 18px;
      }
      .adventure-panel .adventure-table th {
        background: #e2cfa0;
        color: #6b4e22;
        padding: 11px 7px;
        font-size: 1.01rem;
        font-weight: bold;
      }
      .adventure-panel .adventure-table td {
        background: #fffdfa;
        color: #4b3921;
        padding: 10px 7px;
        font-size: .98rem;
      }
      .adventure-panel .adventure-table tr:nth-child(even) td {
        background: #f6eedc;
      }
      .adventure-panel .adventure-filter-select, 
      .adventure-panel .adventure-filter-input {
        font-family: 'Pirata One', cursive;
        font-size: 1.01rem;
        border-radius: 10px 16px 10px 14px;
        padding: 7px 13px;
        border: 2px solid #bca66a;
        background: #fffbe9;
        margin-bottom: 2px;
        outline: none;
        min-width: 80px;
        margin-right: 10px;
      }
      .adventure-panel .adventure-filter-select:focus,
      .adventure-panel .adventure-filter-input:focus {
        border-color: #a88c42;
        background: #fff9cf;
      }
      .adventure-panel .adventure-filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 15px 20px;
        align-items: end;
        margin-bottom: 12px;
      }
      @media (max-width: 720px) {
        .adventure-panel .adventure-filter-row { flex-direction: column; gap: 10px; }
      }
    `}</style>
          <div className='flex-col justify-between flex-col md:flex-row mb-2'>
            <h3 className="adventure-title">Historial de Notas</h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleDownloadPDF}
                className="adventure-btn red"
              >
                Descargar PDF
              </button>
              <button
                onClick={handleDownloadExcel}
                className="adventure-btn green"
              >
                Descargar Excel
              </button>
            </div>
          </div>

          <div className="adventure-filter-row">
            <StudentSelectByName
              students={students}
              value={filter.studentId}
              onChange={e => setFilter(f => ({ ...f, studentId: e.target.value }))}
              className="adventure-filter-select"
            />
            <div>
              <label className="block text-xs adventure-filter-label mb-1">Curso</label>
              <select
                value={filter.courseId}
                onChange={e => setFilter(f => ({ ...f, courseId: e.target.value }))}
                className="adventure-filter-select"
              >
                <option value="">Todos</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs adventure-filter-label mb-1">Trimestre</label>
              <select
                value={filter.quarter}
                onChange={e => setFilter(f => ({ ...f, quarter: e.target.value }))}
                className="adventure-filter-select"
              >
                <option value="">Todos</option>
                {QUARTERS.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs adventure-filter-label mb-1">Año</label>
              <input
                type="number"
                placeholder="Año"
                value={filter.year}
                onChange={e => setFilter(f => ({ ...f, year: e.target.value }))}
                className="adventure-filter-input w-24"
              />
            </div>
            <button
              onClick={handleGetHistoryScores}
              className="adventure-btn"
              style={{ minWidth: 110 }}
              disabled={loading}
            >
              Consultar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="adventure-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Evaluación</th>
                  <th>Nota</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historyScores?.content?.map(s => (
                  <tr key={s.id}>
                    <td>{s.studentFullName}</td>
                    <td>{s.courseName}</td>
                    <td>{s.evaluationName ?? s.evaluation?.name}</td>
                    <td>{s.value}</td>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={historyScores.number}
              totalPages={historyScores.totalPages}
              onChangePage={(newPage) => handleGetHistoryScores(newPage, pageSize)}
              size={pageSize}
              sizeOptions={[20, 50, 100, 500]}
              onChangeSize={handleChangePageSize}
            />
          </div>
        </section>
      )}

    </div>
  );
}
