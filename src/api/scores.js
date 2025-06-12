import { api } from './apiHelper';

// Registra una calificación de estudiante en una evaluación.
// Body: ScoreCreateDTO
/*
{
  studentId:    number,   // ID del estudiante (requerido)
  evaluationId: number,   // ID de la evaluación (requerido)
  value:        number    // Valor de la calificación (requerido)
}
*/
// Responde: ScoreResponseDTO
export function registerScore(data) {
  return api.post('/api/scores', data);
}

// Consulta el promedio ponderado del estudiante en un curso y trimestre/año.
// Query: studentId, courseId, year, quarter
// Responde: number (promedio)
export function getWeightedAverage({ studentId, courseId, year, quarter }) {
  return api.get('/api/scores/average', { params: { studentId, courseId, year, quarter } });
}

// Consulta notas del estudiante autenticado.
// Body: ScoreFilterDTOMe
/*
{
  courseId?:     number,
  evaluationId?: number,
  year?:         string,  
  quarter?:      string,  // PRIMER, SEGUNDO, TERCER, VERANO
  startDate?:    string,  // yyyy-MM-dd
  endDate?:      string
}
*/
// Query: page, size, sort
// Responde: PageScoreResponseDTO
export function getMyScores(filter, page = 0, size = 20, sort) {
  const params = { page, size };
  if (sort) params.sort = sort;
  return api.post('/api/scores/me', filter, { params });
}

// Consulta, paginada, las notas agrupadas por estudiante donde el usuario autenticado es representante.
// Body: ScoreFilterDTOMe (igual a getMyScores)
// Query: page, size, sort
// Responde: PageRepresentativeScoreHistoryDTO
export function getMyChildrenScores(filter, page = 0, size = 20, sort) {
  const params = { page, size };
  if (sort) params.sort = sort;
  return api.post('/api/scores/my-children', filter, { params });
}

// Consulta historial de notas filtrando por estudiante, curso, etc.
// Body: ScoreHistoryFilterDTO
/*
{
  studentId?:    number,
  courseId?:     number,
  evaluationId?: number,
  year?:         string,
  quarter?:      string,  // PRIMER, SEGUNDO, TERCER, VERANO
  startDate?:    string,
  endDate?:      string
}
*/
// Query: page, size, sort
// Responde: PageScoreResponseDTO
export function getScoresHistory(filter, page = 0, size = 20, sort) {
  const params = { page, size };
  if (sort) params.sort = sort;
  return api.post('/api/scores/history', filter, { params });
}

