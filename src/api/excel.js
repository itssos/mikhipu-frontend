import { api } from './apiHelper';

export const uploadExcel = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/students/upload/excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
};
