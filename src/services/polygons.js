import apiClient from '../utilities/api-client';

export const getCountryAdminLevelArea = async (country, adminLevel = 1) =>
  apiClient.get(`/polygons/admin_level_areas?country=${country}&admin_level=${adminLevel}`);

export const getByCoordinates = async (point, adminLevel = 1) =>
  apiClient.post(`/polygons/coordinates`, { point, admin_level: adminLevel });
