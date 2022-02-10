import apiClient from '../utilities/api-client';

export const getScenarios = async (projectId) => apiClient.get(`/projects/${projectId}/scenarios`);

export const createScenario = async (projectId, scenario) =>
  apiClient.post(`/projects/${projectId}/scenarios`, {
    name: scenario.scenarioName,
    from_year: scenario.scenarioPeriod.scenarioStart,
    to_year: scenario.scenarioPeriod.scenarioEnd,
    content: scenario,
  });

export const editScenario = async (projectId, scenario) =>
  apiClient.put(`/projects/${projectId}/scenarios/${scenario.remoteId}`, {
    name: scenario.scenarioName,
    from_year: scenario.scenarioPeriod.scenarioStart,
    to_year: scenario.scenarioPeriod.scenarioEnd,
    content: scenario,
  });

export const deleteAllScenarios = async (projectId) =>
  apiClient.remove(`/projects/${projectId}/scenarios`);

export const deleteScenario = async (projectId, scenario) =>
  apiClient.remove(`/projects/${projectId}/scenarios/${scenario.remoteId}`);
