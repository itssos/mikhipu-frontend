import { api } from './apiHelper';

/**
 * @typedef {Object} EnrollmentCreateDTO
 * @property {number} studentId
 * @property {string} year
 * @property {number} enrollmentFee
 * @property {number} monthlyFee
 * @property {'MATRICULADO'|'RETIRADO'|'ANULADO'|'FINALIZADO'} status
 * @property {string} enrollmentDate - formato ISO 'YYYY-MM-DD'
 */

/**
 * Crea una matrícula para un estudiante.
 * @param {EnrollmentCreateDTO} data
 */
export const createEnrollment = data =>
  api.post('/api/enrollments', data);

/**
 * @typedef {Object} UpdateEnrollmentStatusDTO
 * @property {number} studentId
 * @property {string} year
 * @property {'MATRICULADO'|'RETIRADO'|'ANULADO'|'FINALIZADO'} status
 */

/**
 * Actualiza el estado de la matrícula de un estudiante.
 * @param {UpdateEnrollmentStatusDTO} data
 */
export const updateEnrollmentStatus = data =>
  api.put('/api/enrollments/status', data);

/**
 * Obtiene todas las matrículas de un estudiante.
 * @param {number} studentId
 */
export const getEnrollmentsByStudent = studentId =>
  api.get(`/api/enrollments/student/${studentId}`);
