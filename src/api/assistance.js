// src/api/assistance.js
import { api } from './apiHelper';

/**
 * Obtiene la configuración global de asistencia actualmente activa.
 *
 * @function
 * @returns {Promise<Object>} - Configuración activa.
 */
export const getActiveAssistanceConfig = () =>
  api.get('/api/assistance/config/active');

/**
 * Crea una nueva configuración global de asistencia o la actualiza.
 *
 * @function
 * @param {Object} data - Datos de configuración.
 * @param {string} data.startEntryTime - Hora de inicio de entrada (ej. "08:00").
 * @param {string} data.endEntryTime - Hora de fin de entrada (ej. "08:30").
 * @param {string} data.startExitTime - Hora de inicio de salida (ej. "13:00").
 * @param {string} data.endExitTime - Hora de fin de salida (ej. "13:30").
 * @param {string} data.attendanceDeadline - Fecha/hora límite edición (ej. "2025-06-01T14:00:00").
 * @param {boolean} data.active - Indica si está activa.
 * @returns {Promise<Object>} - Configuración creada o actualizada.
 */
export const createAssistanceConfig = data =>
  api.post('/api/assistance/config', data);

/**
 * Actualiza una configuración global de asistencia existente.
 *
 * @function
 * @param {number} id - ID de la configuración.
 * @param {Object} data - Nuevos datos de configuración.
 * @returns {Promise<Object>} - Configuración actualizada.
 */
export const updateAssistanceConfig = (id, data) =>
  api.put(`/api/assistance/config/${id}`, data);

/**
 * Marca la **entrada** de asistencia para un estudiante (por QR).
 *
 * @function
 * @param {Object} data
 * @param {number} data.studentId - ID del estudiante (leído desde QR).
 * @returns {Promise<Object>} - Registro de asistencia actualizado o creado.
 */
export const registerAssistanceEntry = data =>
  api.post('/api/assistance/records/entry', data);

/**
 * Marca la **salida** de asistencia para un estudiante (por QR).
 *
 * @function
 * @param {Object} data
 * @param {number} data.studentId - ID del estudiante (leído desde QR).
 * @returns {Promise<Object>} - Registro de asistencia actualizado.
 */
export const registerAssistanceExit = data =>
  api.post('/api/assistance/records/exit', data);

/**
 * Edita manualmente un registro de asistencia (opcional, según permisos).
 *
 * @function
 * @param {number} id - ID del registro de asistencia.
 * @param {Object} data - Campos a actualizar (ver DTO).
 * @returns {Promise<Object>} - Registro actualizado.
 */
export const editAssistanceRecord = (id, data) =>
  api.put(`/api/assistance/records/${id}`, data);

/**
 * Consulta registros de asistencia filtrados (paginado).
 *
 * @function
 * @param {Object} params - Parámetros de consulta y filtros.
 * @param {number} [params.studentId] - ID del estudiante.
 * @param {string} [params.entryStatus] - Estado de entrada ("PRESENTE", "TARDANZA", etc.).
 * @param {string} [params.exitStatus] - Estado de salida ("SALIDA_REGULAR", "SALIDA_ANTICIPADA", etc.).
 * @param {string} [params.startDate] - Fecha inicio (YYYY-MM-DD).
 * @param {string} [params.endDate] - Fecha fin (YYYY-MM-DD).
 * @param {number} [params.grade] - Grado del estudiante.
 * @param {string} [params.section] - Sección (ej. "A").
 * @param {string} [params.schoolLevel] - Nivel escolar ("INICIAL", "PRIMARIA").
 * @param {number} [params.courseId] - ID del curso.
 * @param {number} [params.page=0] - Número de página (inicia en 0).
 * @param {number} [params.size=20] - Tamaño de página.
 * @param {string} [params.sort] - Orden (ej. "date,desc").
 * @returns {Promise<Object>} - Objeto paginado: { content, totalElements, totalPages, number, size, ... }
 *
 * Cada elemento en content es:
 * {
 *   id: number,
 *   studentId: number,
 *   firstName: string,
 *   lastName: string,
 *   date: string,
 *   entryMarkedAt: string,
 *   entryStatus: string,
 *   exitMarkedAt: string,
 *   exitStatus: string,
 *   grade: number,
 *   section: string,
 *   schoolLevel: string,
 *   edited: boolean
 * }
 */
export const getAssistanceRecords = params =>
  api.get('/api/assistance/records', { params });

/**
 * Obtiene estadísticas de asistencia paginadas y filtradas.
 *
 * @function
 * @param {Object} params - Parámetros de consulta y filtros.
 * @param {number} [params.studentId] - ID del estudiante.
 * @param {string} [params.entryStatus] - Estado de entrada ("PRESENTE", "TARDANZA", etc.).
 * @param {string} [params.exitStatus] - Estado de salida ("SALIDA_REGULAR", "SALIDA_ANTICIPADA", etc.).
 * @param {string} [params.startDate] - Fecha inicio (YYYY-MM-DD).
 * @param {string} [params.endDate] - Fecha fin (YYYY-MM-DD).
 * @param {number} [params.grade] - Grado del estudiante.
 * @param {string} [params.section] - Sección (ej. "A").
 * @param {string} [params.schoolLevel] - Nivel escolar ("INICIAL", "PRIMARIA").
 * @param {number} [params.courseId] - ID del curso.
 * @param {number} [params.page=0] - Página (base 0).
 * @param {number} [params.size=20] - Tamaño de página.
 * @param {string} [params.sort] - Orden (ej. "studentFullName,asc").
 * @returns {Promise<Object>} - Resultado paginado: { content: [AssistanceStatisticsDTO], totalElements, totalPages, number, size, ... }
 *
 * Cada elemento en content:
 * {
 *   studentId: number,
 *   studentFullName: string,
 *   totalSessions: number,
 *   presentes: number,
 *   tardanzas: number,
 *   ausencias: number,
 *   salidasRegulares: number,
 *   salidasAnticipadas: number,
 *   porcentajeAsistencia: number
 * }
 */
export const getAssistanceStatistics = params =>
  api.get('/api/assistance/report/statistics', { params });

/**
 * Exporta registros de asistencia a PDF según filtros.
 *
 * @function
 * @param {Object} filter - Filtros: { studentId, startDate, endDate, ... }
 * @returns {Promise<Blob>} - Archivo PDF generado.
 */
export const exportAssistancePdf = filter =>
  api.get('/api/assistance/report/export/pdf', {
    params: { filter },
    responseType: 'blob'
  });

/**
 * Exporta registros de asistencia a Excel según filtros.
 *
 * @function
 * @param {Object} filter - Filtros: { studentId, startDate, endDate, ... }
 * @returns {Promise<Blob>} - Archivo Excel generado.
 */
export const exportAssistanceExcel = filter =>
  api.get('/api/assistance/report/export/excel', {
    params: { filter },
    responseType: 'blob'
  });
