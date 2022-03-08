import apiClient from '../utilities/api-client';

export const getEvaluations = async (id) => apiClient.get(`/projects/${id}/focus_area_evaluations`);

export const addEvaluation = async (id, data) =>
  apiClient.post(`/projects/${id}/focus_area_evaluations`, { ...data });

