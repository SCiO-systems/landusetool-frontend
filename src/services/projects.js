import apiClient from '../utilities/api-client';

export const PROJECT_OWNER = 'owner';
export const PROJECT_USER = 'user';

export const DRAFT = 'draft';
export const PREPROCESSING = 'preprocessing';
export const PUBLISHED = 'published';

export const PROJECT_STEPS = {
  REGION_OF_INTEREST: 'RegionOfInterest',
  DATASETS_LAND_USE: 'LandUse',
  DATASETS_LAND_DEGRADATION: 'LandDegradation',
  COMPLETED: 'CurrentState',
  PLANNING: 'LandUsePlanning',
};

export const getNextStep = (project) => {
  if (project.status === PUBLISHED && project.step === PROJECT_STEPS.COMPLETED) {
    return PROJECT_STEPS.PLANNING;
  }

  if (project.step === null) {
    return PROJECT_STEPS.REGION_OF_INTEREST;
  }

  if (project.step === PROJECT_STEPS.REGION_OF_INTEREST) {
    return PROJECT_STEPS.DATASETS_LAND_USE;
  }

  if (project.step === PROJECT_STEPS.DATASETS_LAND_USE) {
    return PROJECT_STEPS.DATASETS_LAND_DEGRADATION;
  }

  return PROJECT_STEPS.COMPLETED;
};

export const getUrlForStep = (id, step) => {
  switch (step) {
    case null:
    case PROJECT_STEPS.REGION_OF_INTEREST:
      return `/setup-project/${id}/region-of-interest`;
    case PROJECT_STEPS.DATASETS_LAND_USE:
      return `/setup-project/${id}/datasets/0`;
    case PROJECT_STEPS.DATASETS_LAND_DEGRADATION:
      return `/setup-project/${id}/datasets/1`;
    case PROJECT_STEPS.COMPLETED:
      return `/current-state`;
    case PROJECT_STEPS.PLANNING:
      return `/land-use-planning`;
    default:
      return `/`;
  }
}

export const getProject = async (id) => apiClient.get(`/projects/${id}`);

export const listProjects = async () => apiClient.get('/projects');

export const createProject = async ({ title, acronym, description }) =>
  apiClient.post('/projects', { title, acronym, description });

export const editProject = async (id, data) =>
  apiClient.put(`/projects/${id}`, data);

export const finaliseProject = async (id) =>
  apiClient.post(`/projects/${id}/finalise`);

export const deleteProject = async (id) =>
  apiClient.remove(`/projects/${id}`);

export const inviteUsers = async (id, users) =>
  apiClient.post(`/projects/${id}/invites`, { user_ids: users });

export const getProjectWocatTechnologies = async (id) =>
  apiClient.get(`/projects/${id}/wocat_technologies`);

export const chooseProjectWocatTechnology = async (id, technologyId) =>
  apiClient.post(`/projects/${id}/choose_wocat_technology`, { technology_id: technologyId });

export const getProjectIndicators = async (id) => apiClient.get(`/projects/${id}/indicators`);

export const saveProjectIndicators = async (id, indicators) =>
  apiClient.put(`/projects/${id}/indicators`, { indicators });

export const getProjectFocusAreas = async (id) => apiClient.get(`/projects/${id}/focus_areas`);

export const addProjectFocusArea = async (id, name, file_id) =>
  apiClient.post(`/projects/${id}/focus_areas`, { name, file_id });

export const deleteProjectFocusArea = async (id, focus_area_id) =>
  apiClient.remove(`/projects/${id}/focus_areas/${focus_area_id}`);

export const findIntersectingArea = async (id, polygonFileId) =>
  apiClient.post(`/projects/${id}/polygons/intersecting_area`, { polygon_file_id: polygonFileId });

export const prepareLDNMap = async (id, polygonsList) =>
  apiClient.post(`/projects/${id}/prepare_ldn_map`, { polygons_list: polygonsList });
