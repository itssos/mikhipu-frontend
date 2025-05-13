import { api } from './apiHelper';

export const createEnrollment = data => api.post('/api/enrollments', data);
export const updateEnrollmentStatus = data => api.patch('/api/enrollments/status', data);
export const getEnrollmentsByStudent = studentId => api.get(`/api/enrollments/student/${studentId}`);