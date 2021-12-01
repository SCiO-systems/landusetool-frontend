import apiClient from '../utilities/api-client';

// eslint-disable-next-line
export const getCountryLevelLinks = async (countryIsoCode3) => apiClient.get(`/country_level_links?country_iso_code_3=${countryIsoCode3}`);
