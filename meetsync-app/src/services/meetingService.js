import api from './api';

export const meetingService = {
  getAll:      () => api.get('/meetings'),
  create:      (data) => api.post('/meetings', data),
  getOne:      (id) => api.get(`/meetings/${id}`),
  remove:      (id) => api.delete(`/meetings/${id}`),
  getUsers:    () => api.get('/users'),
  getUpcoming: () => api.get('/meetings/upcoming'),
};