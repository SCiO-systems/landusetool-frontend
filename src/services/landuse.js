import apiClient from '../utilities/api-client';

// eslint-disable-next-line
export const getWocatTechnologies = async (keyword, from = 0, size = 10) =>
  apiClient.get(`/wocat_technologies?keyword=${keyword}&from=${from}&size=${size}`);
