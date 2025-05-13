import { api } from './apiHelper';

export const getRoles                 = ()                        => api.get('/api/roles');
export const getRoleById              = id                        => api.get(`/api/roles/${id}`);
export const createRole               = roleData                  => api.post('/api/roles', roleData);
export const updateRole               = (id, roleData)            => api.put(`/api/roles/${id}`, roleData);
export const deleteRole               = id                        => api.delete(`/api/roles/${id}`);
export const assignPermissionToRole   = (roleId, permissionName)  => api.post(`/api/roles/${roleId}/permissions/${permissionName}`);
export const removePermissionFromRole = (roleId, permissionName)  => api.delete(`/api/roles/${roleId}/permissions/${permissionName}`);
