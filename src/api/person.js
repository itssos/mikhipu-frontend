import { api } from './apiHelper';

export const getPersons     = ()            => api.get('/api/persons');
export const getPersonById  = id            => api.get(`/api/persons/${id}`);
export const createPerson   = personData    => api.post('/api/persons', personData);
export const updatePerson   = (id, data)    => api.put(`/api/persons/${id}`, data);
export const deletePerson   = id            => api.delete(`/api/persons/${id}`);