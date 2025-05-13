import { api } from './apiHelper';

/**
 * @typedef {Object} UserCreateDTO
 * @property {string} [username]
 * @property {string} [email]
 * @property {string} [password]
 * @property {string} [role]
 */

/**
 * @typedef {Object} PersonCreateDTO
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [dni]
 * @property {string} [birthDate] Format: "YYYY-MM-DD"
 * @property {"MASCULINO"|"FEMENINO"} [gender]
 * @property {string} [address]
 * @property {string} [phone]
 * @property {UserCreateDTO} [user]
 */

/**
 * @typedef {Object} TeacherCreateDTO
 * @property {PersonCreateDTO} person  Required person data
 * @property {string} [code]         Optional teacher code
 */

/**
 * Fetch all teachers
 * @returns {Promise<Object[]>}
 */
export const getTeachers = () => api.get('/api/teachers');

/**
 * Fetch a specific teacher by ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const getTeacherById = id => api.get(`/api/teachers/${id}`);

/**
 * Create a new teacher
 * @param {TeacherCreateDTO} data
 * @returns {Promise<Object>}
 */
export const createTeacher = data => api.post('/api/teachers', data);

/**
 * Update an existing teacher
 * @param {string|number} id
 * @param {TeacherCreateDTO} data
 * @returns {Promise<Object>}
 */
export const updateTeacher = (id, data) => api.put(`/api/teachers/${id}`, data);

/**
 * Delete a teacher by ID
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const deleteTeacher = id => api.delete(`/api/teachers/${id}`);

/**
 * Fetch all students for a given teacher
 * @param {string|number} teacherId
 * @returns {Promise<Object[]>}
 */
export const getStudentsByTeacher = teacherId => api.get(`/api/teachers/${teacherId}/students`);
