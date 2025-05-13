// src/api/courses.js
import { api } from './apiHelper';

/**
 * Obtiene la lista de todos los cursos.
 * 
 * @function
 * @returns {Promise} - Lista de cursos.
 */
export const getCourses = () =>
  api.get('/api/courses');

/**
 * Obtiene un curso por su ID.
 * 
 * @function
 * @param {number} id - ID del curso.
 * @returns {Promise} - Curso correspondiente.
 */
export const getCourseById = id =>
  api.get(`/api/courses/${id}`);

/**
 * Crea un nuevo curso.
 * 
 * @function
 * @param {Object} data - Datos del curso.
 * @param {string} data.name - Nombre del curso.
 * @param {string} data.code - Código del curso.
 * @param {string} [data.description] - Descripción del curso.
 * @param {number} data.year - Año del curso.
 * @param {"PRIMER"|"SEGUNDO"|"TERCER"|"VERANO"} data.quarter - Trimestre del curso.
 * @returns {Promise} - Curso creado.
 */
export const createCourse = data =>
  api.post('/api/courses', data);

/**
 * Actualiza un curso existente.
 * 
 * @function
 * @param {number} id - ID del curso.
 * @param {Object} data - Datos del curso a actualizar (igual que en createCourse).
 * @returns {Promise} - Curso actualizado.
 */
export const updateCourse = (id, data) =>
  api.put(`/api/courses/${id}`, data);

/**
 * Elimina un curso.
 * 
 * @function
 * @param {number} id - ID del curso.
 * @returns {Promise} - Confirmación de eliminación.
 */
export const deleteCourse = id =>
  api.delete(`/api/courses/${id}`);

/**
 * Asigna estudiantes a un curso.
 * 
 * @function
 * @param {number} courseId - ID del curso.
 * @param {number[]} studentIds - Lista de IDs de estudiantes.
 * @returns {Promise} - Confirmación de asignación.
 */
export const assignStudentsToCourse = (courseId, studentIds) =>
  api.post(`/api/courses/${courseId}/students`, { studentIds });

/**
 * Elimina estudiantes de un curso.
 * 
 * @function
 * @param {number} courseId - ID del curso.
 * @param {number[]} studentIds - Lista de IDs de estudiantes.
 * @returns {Promise} - Confirmación de eliminación.
 */
export const removeStudentsFromCourse = (courseId, studentIds) =>
  api.delete(`/api/courses/${courseId}/students`, { data: { studentIds } });

/**
 * Asigna profesores a un curso.
 * 
 * @function
 * @param {number} courseId - ID del curso.
 * @param {Object} data - Datos de los profesores.
 * @param {string} data.mainTeacherCode - Código del profesor principal.
 * @param {string[]} data.auxiliaryTeacherCodes - Códigos de profesores auxiliares.
 * @returns {Promise} - Curso actualizado con los profesores asignados.
 */
export const assignTeachersToCourse = (courseId, data) =>
  api.post(`/api/courses/${courseId}/assign-teachers`, data);

/**
 * Elimina profesores asignados a un curso.
 * 
 * @function
 * @param {number} courseId - ID del curso.
 * @param {Object} data - Datos de los profesores a eliminar.
 * @param {string[]} data.teacherCodes - Códigos de los profesores a eliminar.
 * @returns {Promise} - Curso actualizado con los profesores eliminados.
 */
export const removeTeachersFromCourse = (courseId, data) =>
  api.delete(`/api/courses/${courseId}/assign-teachers`, { data });

/**
 * Obtiene el resumen de estudiantes asignados a un curso.
 * 
 * @function
 * @param {number} courseId - ID del curso.
 * @returns {Promise} - Lista de estudiantes con nombre, DNI, grado, sección y nivel escolar.
 */
export const getStudentsSummaryByCourse = (courseId) =>
  api.get(`/api/courses/${courseId}/students/summary`);

/**
 * Obtiene los docentes asignados a un curso.
 *
 * @function
 * @param {number} courseId - ID del curso.
 * @returns {Promise<Object[]>} - Lista de docentes con su ID, nombre completo, código y rol.
 */
export const getTeachersOfCourse = (courseId) =>
  api.get(`/api/courses/${courseId}/teachers`);
