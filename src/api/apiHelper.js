import axiosInstance from './axiosInstance';

async function request(method, url, data = null, config = {}) {
  try {
    const response = await axiosInstance.request({ method, url, data, ...config });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Error en la petición.';
    throw new Error(msg);
  }
}

export const api = {
  get:    (url,   config)        => request('get',    url, null, config),
  post:   (url,   data, config)  => request('post',   url, data, config),
  put:    (url,   data, config)  => request('put',    url, data, config),
  delete: (url,   data, config)  => request('delete', url, data, config),
  patch:  (url,   data, config)  => request('patch',  url, data, config),
};