import apiClient from '../utilities/api-client';

export const getProject = async (id) =>
  apiClient.get(`/projects/${id}`);

export const listProjects = async () =>
  apiClient.get('/projects');

export const createProject = async ({ title, acronym, description }) =>
  apiClient.post('/projects', { title, acronym, description });

export const editProject = async (id, { title, acronym, description }) =>
  apiClient.put(`/projects/${id}`, { title, acronym, description });

export const inviteUsers = async (id, users) =>
  apiClient.post(`/projects/${id}/invites`, { user_ids: users });
