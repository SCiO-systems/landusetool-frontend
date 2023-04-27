import apiClient from '../utilities/api-client';

export const getWocatTechnologies = async (keyword, from = 0, size = 10) =>
  apiClient.get(`/wocat_technologies?keyword=${keyword}&from=${from}&size=${size}`);

export const getWocatTechnology = async (techId) => apiClient.get(`/wocat_technologies/${techId}`);

export const getEconWocatTechnology = async (techId) =>
  apiClient.get(`/wocat_technologies/${techId}/econ_wocat`);
