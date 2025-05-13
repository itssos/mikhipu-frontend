import { api } from './apiHelper';

export const getRepresentatives       = ()   => api.get('/api/representatives');
export const getRepresentativeById    = id   => api.get(`/api/representatives/${id}`);
export const createRepresentative     = data => api.post('/api/representatives', data);
export const deleteRepresentative     = id   => api.delete(`/api/representatives/${id}`);