import { api } from './apiHelper';

/**
 * Obtiene los horarios de los profesores.
 * 
 * @function
 * @param {Object} params - Parámetros de consulta.
 * @param {number} [params.teacherId] - ID del profesor (opcional).
 * @param {number} [params.courseId] - ID del curso (opcional).
 * @param {"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"} [params.dayOfWeek] - Día de la semana (opcional).
 * @returns {Promise} - Promesa con la respuesta de la API.
 */
export const getTeacherSchedules = (params) => api.get('/api/teacher-schedules', { params });

/**
 * Asigna un nuevo horario a un profesor.
 * 
 * @function
 * @param {Object} data - Datos del horario a asignar.
 * @param {number} data.teacherId - ID del profesor.
 * @param {number} data.courseId - ID del curso.
 * @param {"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"} data.dayOfWeek - Día de la semana.
 * @param {string} data.startTime - Hora de inicio en formato "HH:mm", por ejemplo "14:30".
 * @returns {Promise} - Promesa con la respuesta de la API.
 */
export const assignTeacherSchedule = (data) => api.post('/api/teacher-schedules', data);

/**
 * Elimina un horario asignado a un profesor.
 * 
 * @function
 * @param {Object} params - Parámetros de consulta requeridos para eliminar el horario.
 * @param {number} params.teacherId - ID del profesor (obligatorio).
 * @param {number} params.courseId - ID del curso (obligatorio).
 * @param {"MONDAY"|"TUESDAY"|"WEDNESDAY"|"THURSDAY"|"FRIDAY"|"SATURDAY"|"SUNDAY"} params.dayOfWeek - Día de la semana (obligatorio).
 * @returns {Promise} - Promesa con la respuesta de la API.
 */
export const deleteTeacherSchedule = (params) => api.delete('/api/teacher-schedules', { params });
