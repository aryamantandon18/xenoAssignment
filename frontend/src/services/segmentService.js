import api from './api';

export const getSegments = () => api.get('/segments');
export const getSegment = (id) => api.get(`/segments/${id}`);
export const createSegment = (data) => api.post('/segments/', data);
export const updateSegment = (id, data) => api.put(`/segments/${id}`, data);
export const deleteSegment = (id) => api.delete(`/segments/${id}`);
export const previewSegment = (data) => api.post('/segments/preview', data);