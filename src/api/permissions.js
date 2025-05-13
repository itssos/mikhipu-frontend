import { api } from './apiHelper';

export const getAllPermissions   = ()   => api.get('/api/permissions');
export const getPermissionById   = id   => api.get(`/api/permissions/${id}`);
export const getPermissionByName = name => api.get(`/api/permissions/name/${name}`);
