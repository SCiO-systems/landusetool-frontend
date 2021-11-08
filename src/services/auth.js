import apiClient from '../utilities/api-client';

export const login = async (email, password) =>
  apiClient.post('/login', { email, password });

export const logout = async () => apiClient.post('/logout');

export const verify = async (token) =>
  apiClient.get('/auth/token/check', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
