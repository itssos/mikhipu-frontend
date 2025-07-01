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
    <div className="student-filters-root w-full mb-7">
      <style>{`
      .student-filters-root {
        background: linear-gradient(110deg, #f6faff 60%, #fff9e6 100%);
        border: 2.5px solid #c3dbf7;
        box-shadow: 0 2px 22px #a1b6d866, 0 1px 3px #e2e8f0;
        border-radius: 22px;
        padding: 2.3rem 2rem 1.5rem 2rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1.3rem;
        align-items: end;
      }
      .student-filters-root label {
        font-size: 0.91rem;
        color: #174ea3;
        font-weight: 700;
        margin-bottom: 5px;
        letter-spacing: 0.2px;
      }
      .student-filters-root .input-filter {
        border-radius: 11px;
        background: #fff;
        border: 1.7px solid #b8c8ee;
        padding: 9px 13px;
        box-shadow: 0 2px 7px #eef2f6cc;
        font-size: 1.06rem;
        color: #22335e;
        transition: border-color 0.16s, box-shadow 0.13s;
        outline: none;
      }
      .student-filters-root .input-filter:focus {
        border-color: #2563eb;
        box-shadow: 0 2px 7px #b9cdf9;
        background: #f0f6ff;
      }
      .student-filters-root button {
        border-radius: 13px;
        border: 1.3px solid #e4e8ec;
        background: linear-gradient(93deg, #fff 60%, #f8fafc 100%);
        font-weight: 700;
        color: #475569;
        box-shadow: 0 2px 7px #d2dae7bb;
        padding: 10px 24px;
        font-size: 1.07rem;
        transition: background 0.12s, color 0.09s, box-shadow 0.09s;
      }
      .student-filters-root button:hover {
        background: #f1f5fa;
        color: #1e293b;
        box-shadow: 0 4px 14px #bcd0ec40;
      }
      @media (max-width: 900px) {
        .student-filters-root { padding: 1.3rem 0.7rem 1rem 0.7rem; gap: 0.6rem;}
      }
    `}</style>
      <div className="flex flex-col w-32">
        <label>DNI</label>
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
        <label>Nombre</label>
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
        <label>Grado</label>
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
        <label>Sección</label>
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
        <label>Nivel Escolar</label>
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
        <label>Curso</label>
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
        className="flex items-center gap-2"
        title="Limpiar filtros"
      >
        <XCircleIcon className="w-5 h-5 text-gray-400" />
        Limpiar
      </button>
    </div>
  );

}
