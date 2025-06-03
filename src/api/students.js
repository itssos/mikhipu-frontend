// src/api/students.js
import { api } from './apiHelper';

/**
 * Obtiene lista paginada y filtrada de estudiantes.
 *
 * @function
 * @param {Object} params - Parámetros de filtro y paginación.
 * @param {string} [params.dni] - DNI del estudiante.
 * @param {string} [params.name] - Nombre completo o parcial.
 * @param {number} [params.grade] - Grado.
 * @param {string} [params.section] - Sección (ej. "A").
 * @param {string} [params.schoolLevel] - Nivel escolar ("INICIAL", "PRIMARIA").
 * @param {number} [params.courseId] - ID del curso.
 * @param {number} [params.page=0] - Página (base 0).
 * @param {number} [params.size=20] - Tamaño de página.
 * @param {string} [params.sort] - Orden (ej. "fullName,asc").
 * @returns {Promise<Object>} - Resultado paginado: { content: [StudentCourseViewDTO], totalElements, totalPages, number, size, ... }
 *
 * Cada elemento en content:
 * {
 *   id: number,
 *   fullName: string,
 *   dni: string,
 *   grade: number,
 *   section: string,
 *   schoolLevel: string
 * }
 */
export const getStudents = (params = {}) =>
  api.get('/api/students', { params });


export const getStudentById = id =>  api.get(`/api/students/${id}`);

export const createStudent = data =>  api.post('/api/students', data);

export const updateStudent = (id, data) =>  api.put(`/api/students/${id}`, data);

export const deleteStudent = id =>  api.delete(`/api/students/${id}`);

export const uploadStudentList = list =>  api.post('/api/students/upload/list', list);

export const uploadStudentsFromExcel = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/students/upload/excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};

// Representantes del estudiante
export const assignRepresentatives = (studentId, representativeIds) =>
  api.post(`/api/students/${studentId}/representatives`, {
    representativeIds
  });

export const removeRepresentatives = (studentId, representativeIds) =>
  api.delete(`/api/students/${studentId}/representatives`, {
    data: { representativeIds }
  });

export const getStudentRepresentatives = (studentId) =>
  api.get(`/api/students/${studentId}/representatives`);
