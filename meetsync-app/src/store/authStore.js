import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user:  null,
  token: localStorage.getItem('token') || null,

  login: async (email, password) => {
    const { data } = await api.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, token: data.token });
  },

register: async (name, email, password, passwordConfirmation) => {
  const { data } = await api.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  localStorage.setItem('token', data.token);
  set({ user: data.user, token: data.token });
},
  logout: async () => {
    await api.post('/logout').catch(() => {});
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/me');
      set({ user: data });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },
}));

export default useAuthStore;
