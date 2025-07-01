import React, { useState, useEffect, useRef } from "react";
import { getStudents } from "../../api/students";
import { getCourses } from "../../api/courses";
import useAuth from "../../hooks/useAuth";
import useRol from "../../hooks/useRol";

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
  const { user, person } = useAuth();
  const isStudent = useRol(['ESTUDIANTE']);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    getCourses().then(setCourses).catch(() => setCourses([]));
  }, []);
  // Autocomplete student
  const [studentQuery, setStudentQuery] = useState("");
  const [studentResults, setStudentResults] = useState([]);
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
  useEffect(() => { fetchData(); }, [filters]);
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
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0,
    }));
  };
  const handleClearFilters = () => {
    if (isStudent && person) {
      setFilters(f => ({
        ...DEFAULT_FILTERS,
        studentId: user.studentId || user.id,
        size: filters.size || 20,
      }));
      setStudentQuery(`${person.firstName} ${person.lastName} (${person.dni})`);
      setStudentResults([]);
    } else {
      setFilters({ ...DEFAULT_FILTERS, size: filters.size || 20 });
      setStudentResults([]);
      setStudentQuery("");
    }
  };
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  useEffect(() => {
    if (isStudent && person) {
      const fullName = `${person.firstName} ${person.lastName} (${person.dni})`;
      setStudentQuery(fullName);
      setFilters(f => ({
        ...f,
        studentId: user.studentId || user.id,
      }));
      const ul = ulRef.current;
      if (ul && ul.firstElementChild && ul.firstElementChild.tagName === 'LI') {
        ul.firstElementChild.click();
      }
    }
  }, [isStudent, person, user]);
  useEffect(() => {
    if (isStudent) setStudentResults([]);
  }, [isStudent]);

  const ulRef = useRef(null);

  useEffect(() => {
    // Solo ejecuta una vez al montar
    const ul = ulRef.current;
    if (ul && ul.firstElementChild && ul.firstElementChild.tagName === 'LI') {
      ul.firstElementChild.click();
    }
  }, isStudent);

  // Dentro del componente, antes del return:
  const firstLiRef = useRef(null);

  // Dispara el click automático cuando llegan los resultados:
  useEffect(() => {
    if (studentResults.length > 0 && firstLiRef.current) {
      firstLiRef.current.click();
    }
  }, [studentResults]);

  return (
    <div className="mb-10 adventure-panel">
      <style>{`
        .adventure-panel.adventure-filters {
          border: 7px solid #574d32;
          border-radius: 28px 28px 30px 30px;
          box-shadow: 0 0 18px #000a;
          font-family: 'Pirata One', cursive, monospace;
          padding: 22px 26px 18px 26px;
        }
        .adventure-panel .adventure-filter-label {
          font-family: 'Pirata One', cursive;
          color: #6b4f22;
          font-size: 1.04rem;
          margin-bottom: 2px;
        }
        .adventure-panel .adventure-filter-input,
        .adventure-panel .adventure-filter-select {
          font-family: 'Pirata One', cursive;
          font-size: 1.01rem;
          border-radius: 12px 18px 10px 16px;
          padding: 8px 14px;
          border: 2.2px solid #bca66a;
          background: #fffbe9;
          box-shadow: 1px 2px #e2d1aa;
          outline: none;
          margin-bottom: 2px;
          min-width: 80px;
        }
        .adventure-panel .adventure-filter-input:focus,
        .adventure-panel .adventure-filter-select:focus {
          border-color: #a88c42;
          background: #fff9cf;
        }
        .adventure-panel .adventure-autocomplete {
          position: relative;
        }
        .adventure-panel .adventure-autocomplete-list {
          position: absolute;
          left: 0; right: 0; top: 100%;
          z-index: 100;
          background: #fffbe8;
          border: 2px solid #cbb679;
          border-radius: 11px;
          box-shadow: 1px 4px 12px #5b462c22;
          margin-top: 2px;
          font-size: 1rem;
          max-height: 180px;
          overflow-y: auto;
        }
        .adventure-panel .adventure-autocomplete-list li {
          padding: 8px 15px;
          cursor: pointer;
        }
        .adventure-panel .adventure-autocomplete-list li:hover {
          background: #f6e9b6;
        }
        .adventure-panel .adventure-filters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 20px 22px;
          align-items: end;
        }
        .adventure-panel .adventure-clear-btn {
          background: linear-gradient(120deg, #e6e1a2 60%, #bcad65 100%);
          color: #795c28;
          border-radius: 9px;
          border: 2px solid #cfb44b;
          font-family: 'Pirata One', cursive;
          padding: 8px 20px;
          font-size: 1rem;
          transition: background .12s, color .13s, transform .1s;
          box-shadow: 1px 2px #dec98a;
          margin-left: 20px;
        }
        .adventure-panel .adventure-clear-btn:active {
          background: #a39354;
          color: #fffbe0;
          transform: scale(.97);
        }
      `}</style>
      <div className="adventure-filters-row mb-6">
        {/* Autocompletado de estudiante */}
        <div className="adventure-autocomplete">
          <label className="adventure-filter-label block">Estudiante</label>
          <input
            className="adventure-filter-input w-56"
            placeholder="Buscar por nombre o DNI"
            value={studentQuery}
            onChange={e => setStudentQuery(e.target.value)}
            autoComplete="off"
          />
          {studentResults.length > 0 && (
            <ul className="adventure-autocomplete-list">
              {studentResults.map((s, i) => (
                <li
                  key={s.id}
                  ref={i === 0 ? firstLiRef : null}
                  onClick={() => {
                    setStudentQuery(`${s.fullName} (${s.dni})`);
                    let e = { target: { name: "studentId", value: s.id } };
                    handleFilterChange(e);
                    setStudentResults([]);
                  }}
                >
                  {s.fullName} <span style={{ color: "#baa66a" }}>({s.dni})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Estado entrada */}
        <div>
          <label className="adventure-filter-label block">Estado entrada</label>
          <select
            name="entryStatus"
            value={filters.entryStatus}
            onChange={handleFilterChange}
            className="adventure-filter-select w-40"
          >
            {ENTRY_STATUS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Estado salida */}
        <div>
          <label className="adventure-filter-label block">Estado salida</label>
          <select
            name="exitStatus"
            value={filters.exitStatus}
            onChange={handleFilterChange}
            className="adventure-filter-select w-40"
          >
            {EXIT_STATUS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Fechas */}
        <div>
          <label className="adventure-filter-label block">Desde</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="adventure-filter-input w-36"
          />
        </div>
        <div>
          <label className="adventure-filter-label block">Hasta</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="adventure-filter-input w-36"
          />
        </div>
        {/* Grado */}
        <div>
          <label className="adventure-filter-label block">Grado</label>
          <select
            name="grade"
            value={filters.grade}
            onChange={handleFilterChange}
            className="adventure-filter-select w-24"
          >
            {GRADES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Sección */}
        <div>
          <label className="adventure-filter-label block">Sección</label>
          <select
            name="section"
            value={filters.section}
            onChange={handleFilterChange}
            className="adventure-filter-select w-20"
          >
            {SECTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Nivel escolar */}
        <div>
          <label className="adventure-filter-label block">Nivel</label>
          <select
            name="schoolLevel"
            value={filters.schoolLevel}
            onChange={handleFilterChange}
            className="adventure-filter-select w-32"
          >
            {SCHOOL_LEVELS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {/* Cursos */}
        <div>
          <label className="adventure-filter-label block">Curso</label>
          <select
            name="courseId"
            value={filters.courseId}
            onChange={handleFilterChange}
            className="adventure-filter-select w-44"
          >
            <option value="">Todos los cursos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.year})
              </option>
            ))}
          </select>
        </div>
        {/* Más filtros personalizados */}
        {extraFilters && extraFilters({ filters, onChange: handleFilterChange })}
        <button
          type="button"
          onClick={handleClearFilters}
          className="adventure-clear-btn"
        >
          Limpiar
        </button>
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
