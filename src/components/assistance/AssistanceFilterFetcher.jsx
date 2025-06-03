import React, { useState, useEffect } from "react";
import { getStudents } from "../../api/students";
import { getCourses } from "../../api/courses";

// Opciones de los selects
const ENTRY_STATUS = [
  { value: "", label: "Todos" },
  { value: "PRESENTE", label: "Presente" },
  { value: "TARDANZA", label: "Tardanza" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "NO_MARCADA", label: "No marcada" }
];

const EXIT_STATUS = [
  { value: "", label: "Todos" },
  { value: "SALIDA_REGULAR", label: "Salida regular" },
  { value: "SALIDA_ANTICIPADA", label: "Salida anticipada" },
  { value: "NO_MARCADA", label: "No marcada" }
];

const SCHOOL_LEVELS = [
  { value: "", label: "Todos" },
  { value: "INICIAL", label: "Inicial" },
  { value: "PRIMARIA", label: "Primaria" },
];

const SECTIONS = [
  { value: "", label: "Todas" },
  ...["A", "B", "C", "D", "E", "F"].map(s => ({ value: s, label: s })),
];

const GRADES = [
  { value: "", label: "Todos" },
  ...[1, 2, 3, 4, 5, 6].map(n => ({ value: n, label: n })),
];

const DEFAULT_FILTERS = {
  studentId: "",
  entryStatus: "",
  exitStatus: "",
  startDate: "",
  endDate: "",
  grade: "",
  section: "",
  schoolLevel: "",
  courseId: "",
  page: 0,
  size: 20,
  sort: "",
};

export default function AssistanceFilterFetcher({
  fetchFunction,
  initialFilters = {},
  extraFilters,
  children,
}) {
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, ...initialFilters });
  const [content, setContent] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cursos dinámicos
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    getCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  // Student autocomplete
  const [studentQuery, setStudentQuery] = useState("");
  const [studentResults, setStudentResults] = useState([]);

  // Fetch principal
  const fetchData = async (newFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchFunction(newFilters);
      setContent(res.content || []);
      setTotalPages(res.totalPages ?? 1);
      setTotalElements(res.totalElements ?? 0);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Error al cargar datos.");
    }
    setLoading(false);
  };

  // Fetch data y autocomplete
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    if (studentQuery.trim() === "") {
      setStudentResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      const isNumeric = /^\d+$/.test(studentQuery.trim());
      const filters = isNumeric
        ? { dni: studentQuery.trim() }
        : { name: studentQuery.trim() };
      getStudents(filters)
        .then(res => setStudentResults(res.content))
        .catch(() => setStudentResults([]));
    }, 400);
    return () => clearTimeout(timeout);
  }, [studentQuery]);

  // Handlers filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0,
    }));
  };

  const handleClearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, size: filters.size || 20 });
    setStudentResults([]);
    setStudentQuery("");
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div>
      {/* Filtros */}
      <div className="w-full bg-gradient-to-tr from-blue-50 via-white to-gray-50 border border-blue-100 shadow-2xl rounded-2xl p-6 mb-6 flex flex-wrap gap-4 items-end">
        {/* Autocompletado de estudiante */}
        <div className="relative col-span-2">
          <label className="text-gray-700 text-sm font-medium mb-1 block">Estudiante</label>
          <input
            className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Buscar por nombre o DNI"
            value={studentQuery}
            onChange={e => {
              setStudentQuery(e.target.value);
            }}
            autoComplete="off"
          />
          {studentResults.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white z-10 rounded-xl shadow border mt-1 max-h-44 overflow-y-auto">
              {studentResults.map(s => (
                <li
                  key={s.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => {
                    setStudentQuery(`${s.fullName} (${s.dni})`);
                    let e = { target: { name: "", value: undefined } };
                    e.target.name = "studentId";
                    e.target.value = s.id;
                    handleFilterChange(e);
                    setStudentResults([]);
                  }}
                >
                  {s.fullName} <span className="text-xs text-gray-400">({s.dni})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Estado entrada */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-1 block">Estado entrada</label>
          <select
            name="entryStatus"
            value={filters.entryStatus}
            onChange={handleFilterChange}
            className="input-filter w-40"
          >
            {ENTRY_STATUS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Estado salida */}
        <div>
          <label className="text-gray-700 text-sm font-medium mb-1 block">Estado salida</label>
          <select
            name="exitStatus"
            value={filters.exitStatus}
            onChange={handleFilterChange}
            className="input-filter w-40"
          >
            {EXIT_STATUS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Fechas */}
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="input-filter w-36"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="input-filter w-36"
        />

        {/* Grado */}
        <select
          name="grade"
          value={filters.grade}
          onChange={handleFilterChange}
          className="input-filter w-24"
        >
          {GRADES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Sección */}
        <select
          name="section"
          value={filters.section}
          onChange={handleFilterChange}
          className="input-filter w-20"
        >
          {SECTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Nivel escolar */}
        <select
          name="schoolLevel"
          value={filters.schoolLevel}
          onChange={handleFilterChange}
          className="input-filter w-32"
        >
          {SCHOOL_LEVELS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Cursos desde API */}
        <select
          name="courseId"
          value={filters.courseId}
          onChange={handleFilterChange}
          className="input-filter w-44"
        >
          <option value="">Todos los cursos</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.year})
            </option>
          ))}
        </select>
        {/* Más filtros personalizados */}
        {extraFilters && extraFilters({ filters, onChange: handleFilterChange })}
        <button
          onClick={handleClearFilters}
          className="ml-auto px-4 py-2 text-sm rounded-xl bg-white hover:bg-gray-100 border border-gray-300 shadow transition"
        >
          Limpiar
        </button>
        <style>{`
          .input-filter {
            @apply px-3 py-2 border border-blue-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
          }
        `}</style>
      </div>
      {/* Render prop para mostrar tabla/tarjeta como quieras */}
      {children({
        content,
        filters,
        loading,
        error,
        totalPages,
        totalElements,
        onPageChange: handlePageChange,
        refetch: fetchData,
      })}
    </div>
  );
}
