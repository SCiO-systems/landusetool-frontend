import apiClient from '../utilities/api-client';

// Profile
export const getUserProfile = async (id) => apiClient.get(`/users/${id}`);
export const updateUserProfile = async (id, data) =>
  apiClient.put(`/users/${id}`, data);

// Avatar
export const getUserAvatar = async (id) => apiClient.get(`/users/${id}/avatar`);
export const updateUserAvatar = async (id, data) =>
  apiClient.post(`/users/${id}/avatar`, data, {
    'Content-Type': 'multipart/form-data',
  });

// Password
export const changeUserPassword = async (id, data) =>
  apiClient.put(`/users/${id}/password`, data);

// Registration
export const registerUser = async (data) => apiClient.post(`/register`, data);

// Search
export const searchUsers = async (name) => apiClient.get(`/users?name=${name}`);
