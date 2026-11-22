import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vybe-backend-pvvh.onrender.com',
  withCredentials: true,
});

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getAllMusics = () => api.get('/music');
export const getAllAlbums = () => api.get('/music/albums');
export const createMusic = (formData) => api.post('/music/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const createAlbum = (data) => api.post('/music/album', data);

export default api;
