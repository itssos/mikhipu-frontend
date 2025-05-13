import { api } from './apiHelper';

export const getTeacherSchedules = (params) => api.get('/api/teacher-schedules', { params });
export const assignTeacherSchedule = (data) => api.post('/api/teacher-schedules', data);
export const deleteTeacherSchedule = (params) => api.delete('/api/teacher-schedules', { params });