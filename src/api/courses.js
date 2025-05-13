import { api } from './apiHelper';

export const getCourses = () => api.get('/api/courses');
export const getCourseById = id => api.get(`/api/courses/${id}`);
export const createCourse = data => api.post('/api/courses', data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse = id => api.delete(`/api/courses/${id}`);
export const assignStudentsToCourse = (courseId, studentIds) => api.post(`/api/courses/${courseId}/students`, { studentIds });
export const removeStudentsFromCourse = (courseId, studentIds) => api.delete(`/api/courses/${courseId}/students`, { data: { studentIds } });
export const assignTeachersToCourse = (courseId, data) => api.post(`/api/courses/${courseId}/assign-teachers`, data);
export const removeTeachersFromCourse = (courseId, data) => api.delete(`/api/courses/${courseId}/assign-teachers`, { data });
export const getStudentsSummaryByCourse = (courseId) => api.get(`/api/courses/${courseId}/students/summary`);