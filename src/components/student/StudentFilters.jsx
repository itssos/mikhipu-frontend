// src/components/student/StudentFilters.jsx
import React, { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getCourses } from "../../api/courses"; // Ajusta la ruta según tu estructura

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

export default function StudentFilters({ filters, onChange, onClear }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then(r => setCourses(r));
  }, []);

  return (
    <div className="w-full bg-gradient-to-tr from-blue-50 via-white to-gray-50 border border-blue-100 shadow-2xl rounded-2xl p-6 mb-6 flex flex-wrap gap-4 items-end">
      <div className="flex flex-col w-32">
        <label className="text-xs text-blue-800 mb-1">DNI</label>
        <input
          type="text"
          name="dni"
          value={filters.dni}
          onChange={onChange}
          placeholder="DNI"
          className="input-filter"
        />
      </div>
      <div className="flex flex-col w-40">
        <label className="text-xs text-blue-800 mb-1">Nombre</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={onChange}
          placeholder="Nombre"
          className="input-filter"
        />
      </div>
      <div className="flex flex-col w-24">
        <label className="text-xs text-blue-800 mb-1">Grado</label>
        <select
          name="grade"
          value={filters.grade}
          onChange={onChange}
          className="input-filter"
        >
          {GRADES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-28">
        <label className="text-xs text-blue-800 mb-1">Sección</label>
        <select
          name="section"
          value={filters.section}
          onChange={onChange}
          className="input-filter"
        >
          {SECTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-32">
        <label className="text-xs text-blue-800 mb-1">Nivel Escolar</label>
        <select
          name="schoolLevel"
          value={filters.schoolLevel}
          onChange={onChange}
          className="input-filter"
        >
          {SCHOOL_LEVELS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-48">
        <label className="text-xs text-blue-800 mb-1">Curso</label>
        <select
          name="courseId"
          value={filters.courseId}
          onChange={onChange}
          className="input-filter"
        >
          <option value="">Todos</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.year})
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-white hover:bg-gray-100 border border-gray-300 shadow transition ml-auto"
        title="Limpiar filtros"
      >
        <XCircleIcon className="w-5 h-5 text-gray-400" />
        Limpiar
      </button>
      {/* Estilos Tailwind extra para inputs, si no está en global.css */}
      <style>{`
        .input-filter {
          @apply px-3 py-2 border border-blue-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
        }
      `}</style>
    </div>
  );
}
