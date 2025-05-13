import { api } from './apiHelper';

export const getTeachers = () => api.get('/api/teachers');
export const getTeacherById = id => api.get(`/api/teachers/${id}`);
export const createTeacher = data => api.post('/api/teachers', data);
export const updateTeacher = (id, data) => api.put(`/api/teachers/${id}`, data);
export const deleteTeacher = id => api.delete(`/api/teachers/${id}`);
export const getStudentsByTeacher = teacherId => api.get(`/api/teachers/${teacherId}/students`);