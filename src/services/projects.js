import apiClient from '../utilities/api-client';

export const listProjects = async () =>
  apiClient.get('/projects');

export const createProject = async ({ title, acronym, description }) =>
  apiClient.post('/projects', { title, acronym, description });
