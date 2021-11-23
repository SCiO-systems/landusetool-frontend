import apiClient from '../utilities/api-client';

export const PROJECT_OWNER = 'owner';
export const PROJECT_USER = 'user';

export const getProject = async (id) => apiClient.get(`/projects/${id}`);

export const listProjects = async () => apiClient.get('/projects');

export const createProject = async ({
  title,
  acronym,
  description,
  adminLevel,
  country,
  polygon,
}) =>
  apiClient.post('/projects', {
    title,
    acronym,
    description,
    country,
    admin_level: adminLevel,
    polygon,
  });

export const editProject = async (id, { title, acronym, description }) =>
  apiClient.put(`/projects/${id}`, { title, acronym, description });

export const inviteUsers = async (id, users) =>
  apiClient.post(`/projects/${id}/invites`, { user_ids: users });
