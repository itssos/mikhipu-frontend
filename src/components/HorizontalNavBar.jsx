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
    <div className="max-w-5xl mx-auto p-6 bg-white/90 rounded-2xl shadow-xl mt-8">
      <ToastContainer position="top-right" autoClose={1700} hideProgressBar />
      <h2 className="text-2xl font-bold mb-6">Gestión de Calificaciones</h2>

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
        <section className="mb-8 bg-green-50 rounded-xl p-4 shadow space-y-3">
          <h3 className="font-semibold text-green-900">Consultar Promedio Ponderado</h3>
          <form className="flex gap-4 flex-wrap items-end" onSubmit={handleGetAverage}>
            <StudentSelectByName
              students={students}
              value={averageForm.studentId}
              onChange={e => setAverageForm(f => ({ ...f, studentId: e.target.value }))}
            />
            <div>
              <label className="block text-xs">Curso</label>
              <select
                value={averageForm.courseId}
                onChange={e => setAverageForm(f => ({ ...f, courseId: e.target.value }))}
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
                value={averageForm.quarter}
                onChange={e => setAverageForm(f => ({ ...f, quarter: e.target.value }))}
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
                value={averageForm.year}
                onChange={e => setAverageForm(f => ({ ...f, year: e.target.value }))}
                className="rounded-lg border p-2 w-24"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
              disabled={loading}
            >
              Consultar
            </button>
          </form>
          {average !== null &&
            <div className="font-bold text-lg mt-2 text-green-800">
              Promedio: {average}
            </div>
          }
        </section>
      )}

      {/* MIS NOTAS */}
      {(canSelf && isEstudiante) && (
        <section className="mb-8 bg-purple-50 rounded-xl p-4 shadow space-y-3">
          <div className='flex justify-between flex-col md:flex-row'>
            <h3 className="font-semibold text-purple-900">Mis Notas</h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleDownloadMyScoresPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Descargar PDF
              </button>
              <button
                onClick={handleDownloadMyScoresExcel}
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
              onClick={handleGetMyScores}
              className="bg-purple-700 text-white px-4 py-2 rounded-xl hover:bg-purple-800"
              disabled={loading}
            >
              Consultar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-purple-100">
                  <th className="p-2">Curso</th>
                  <th className="p-2">Evaluación</th>
                  <th className="p-2">Nota</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {myScores.map(s => (
                  <tr key={s.id}>
                    <td className="p-2">{s.courseName ?? s.course?.name}</td>
                    <td className="p-2">{s.evaluationName ?? s.evaluation?.name}</td>
                    <td className="p-2">{s.value}</td>
                    <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* HISTORIAL - SOLO ADMINISTRADOR O DOCENTE */}
      {isAdminOrTeacher && (
        <section className="mb-8 bg-gray-50 rounded-xl p-4 shadow space-y-3">
          <div className='flex justify-between flex-col md:flex-row'>
            <h3 className="font-semibold text-gray-900">Historial de Notas</h3>
            <div className="flex gap-2 mb-2">
              <button
                onClick={handleDownloadPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Descargar PDF
              </button>
              <button
                onClick={handleDownloadExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Descargar Excel
              </button>
            </div>
          </div>

          <div className="flex gap-3 items-center">

            <StudentSelectByName
              students={students}
              value={filter.studentId}
              onChange={e => setFilter(f => ({ ...f, studentId: e.target.value }))}
            />

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
              onClick={handleGetHistoryScores}
              className="bg-gray-600 text-white px-4 h-10 rounded-xl hover:bg-gray-700 self-end"
              disabled={loading}
            >
              Consultar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Estudiante</th>
                  <th className="p-2">Curso</th>
                  <th className="p-2">Evaluación</th>
                  <th className="p-2">Nota</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historyScores?.content?.map(s => (
                  <tr key={s.id}>
                    <td className="p-2">{s.studentFullName}</td>
                    <td className="p-2">{s.courseName}</td>
                    <td className="p-2">{s.evaluationName ?? s.evaluation?.name}</td>
                    <td className="p-2">{s.value}</td>
                    <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
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
