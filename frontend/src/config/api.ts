import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        await keycloak.updateToken(30); // Atualiza se expirar em < 30s
        if (keycloak.token) {
          config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
      } catch (error) {
        console.error('Falha ao atualizar token', error);
        keycloak.login();
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
