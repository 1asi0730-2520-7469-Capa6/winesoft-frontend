// ...new file...
import { BaseApi } from '../../shared/infrastructure/base-api';

const api = new BaseApi().http;

// NOTE: Assumed endpoints: /api/auth/login and /api/auth/register
// If your backend uses different paths, update the strings below to match Swagger.

export async function login(username, password) {
  const payload = { username, password };
  const resp = await api.post('/api/auth/login', payload);
  return resp.data;
}

export async function register(username, email, password) {
  const payload = { username, email, password };
  const resp = await api.post('/api/auth/register', payload);
  return resp.data;
}

export function attachAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

