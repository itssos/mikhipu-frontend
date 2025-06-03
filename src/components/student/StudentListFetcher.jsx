// src/components/student/StudentListFetcher.jsx
import React, { useEffect, useState } from "react";
import { getStudents } from "../../api/students";
import StudentFilters from "./StudentFilters";

const DEFAULT_FILTERS = {
  dni: "",
  name: "",
  grade: "",
  section: "",
  schoolLevel: "",
  courseId: "",
  page: 0,
  size: 12,
};

export default function StudentListFetcher({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = async (newFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const data = await getStudents(newFilters).then(r => r);
      setStudents(data.content || []);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Error al cargar estudiantes.");
    }
    setLoading(false);
  };

  // Fetch al montar/cambiar filtros
  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line
  }, [filters]);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0,
    }));
  };
  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Render prop: children({students, filters, ...})
  return (
    <div className="w-full">
      <StudentFilters filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
      {children({
        students,
        loading,
        error,
        filters,
        totalPages,
        totalElements,
        onPageChange: handlePageChange,
        refetch: fetchStudents,
      })}
    </div>
  );
}
