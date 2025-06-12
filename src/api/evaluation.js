import { api } from './apiHelper';

// Crea una evaluación. Solo docentes.
// Body: EvaluationCreateDTO
/*
{
  courseId:   number,   // ID del curso asociado (requerido)
  name:       string,   // Nombre de la evaluación (requerido)
  type:       string,   // Tipo de evaluación: EXAM, PROJECT, QUIZ, ASSIGNMENT, PRESENTATION, OTHER (requerido)
  weight:     number,   // Peso (%) de la evaluación en el promedio (requerido)
  date:       string,   // Fecha de la evaluación (yyyy-MM-dd) (requerido)
  minScore:   number,   // Nota mínima permitida (requerido)
  maxScore:   number    // Nota máxima permitida (requerido)
}
*/
// Responde: EvaluationResponseDTO
export function createEvaluation(data) {
  return api.post('/api/evaluations', data);
}


// Consulta detalles de una evaluación.
// Params: id (Long)
// Responde: EvaluationResponseDTO
export function getEvaluationById(id) {
  return api.get(/api/evaluations/${id});
}

// Edita una evaluación existente.
// Params: id (Long)
// Body: EvaluationCreateDTO (igual a createEvaluation)
// Responde: EvaluationResponseDTO
export function updateEvaluation(id, data) {
  return api.put(/api/evaluations/${id}, data);
}

// Elimina una evaluación por ID.
// Params: id (Long)
// Responde: { status: 200 }
export function deleteEvaluation(id) {
  return api.delete(/api/evaluations/${id});
}

// Lista evaluaciones con filtros y paginación.
// Body: EvaluationFilterDTO
/*
{
  courseId?:   number,    // ID del curso
  teacherId?:  number,    // ID del docente principal
  year?:       string,    // Año académico (ejemplo: 2025)
  quarter?:    string,    // PRIMER, SEGUNDO, TERCER, VERANO
  type?:       string,    // Tipo de evaluación
  startDate?:  string,    // Fecha inicio (yyyy-MM-dd)
  endDate?:    string     // Fecha fin (yyyy-MM-dd)
}
*/
// Query: page, size, sort
// Responde: PageEvaluationResponseDTO (paginado)
export function filterEvaluations(filter, page = 0, size = 20, sort) {
  const params = { page, size };
  if (sort) params.sort = sort;  
  return api.post('/api/evaluations/filter', filter, { params });
}