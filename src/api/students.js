// src/api/students.js
import { api } from './apiHelper';

export const getStudents = (filters = {}) =>  api.get('/api/students', { params: filters });

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
