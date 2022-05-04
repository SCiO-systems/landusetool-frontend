import apiClient from '../utilities/api-client';

export const uploadProjectFile = async (projectId, formData) =>
  apiClient.post(`/projects/${projectId}/files`, formData, {
    'Content-Type': 'multipart/form-data',
  });

export const getProjectFiles = async (projectId) =>
  apiClient.get(`/projects/${projectId}/files`);

export const getProjectFile = async (projectId, fileId) =>
  apiClient.get(`/projects/${projectId}/files/${fileId}`);

export const deleteFile = async (projectId, fileId) =>
  apiClient.remove(`/projects/${projectId}/files/${fileId}`);
