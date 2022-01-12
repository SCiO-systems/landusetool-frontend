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
    country_iso_code_3: country,
    administrative_level: adminLevel,
    polygon,
  });

export const editProject = async (id, { title, acronym, description }) =>
  apiClient.put(`/projects/${id}`, { title, acronym, description });

export const inviteUsers = async (id, users) =>
  apiClient.post(`/projects/${id}/invites`, { user_ids: users });

export const getProjectWocatTechnologies = async (id) =>
  apiClient.get(`/projects/${id}/wocat_technologies`);

export const chooseProjectWocatTechnology = async (id, technologyId) =>
  apiClient.post(`/projects/${id}/choose_wocat_technology`, { technology_id: technologyId });

export const saveProjectIndicators = async (id, indicators) =>
  apiClient.put(`/projects/${id}/indicators`, { indicators });
