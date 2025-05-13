// src/api/students.js
import { api } from './apiHelper';

export const getStudents       = ()         => api.get('/api/students');
export const getStudentById    = id         => api.get(`/api/students/${id}`);
export const createStudent     = data       => api.post('/api/students', data);
export const updateStudent     = (id, data) => api.put(`/api/students/${id}`, data);
export const deleteStudent     = id         => api.delete(`/api/students/${id}`);
export const uploadStudentList = list       => api.post('/api/students/upload/list', list);
