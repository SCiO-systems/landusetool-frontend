import apiClient from '../utilities/api-client';

export const getCountryAdminLevelArea = async (country, adminLevel = 1) =>
  apiClient.get(`/polygons/admin_level_areas?country_iso_code_3=${country}&administrative_level=${adminLevel}`);

export const getByCoordinates = async (point, adminLevel = 1) =>
  apiClient.post(`/polygons/coordinates`, { point, administrative_level: adminLevel });

