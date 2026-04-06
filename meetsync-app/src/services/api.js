import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Accept': 'application/json' },
});

// ── Intercepteur requête : injecte le token ───────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Intercepteur réponse : gère les erreurs ───────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expiré ou invalide → retour au login
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Erreur serveur → message dans la console
    if (status === 500) {
      console.error('Erreur serveur Laravel', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default api;