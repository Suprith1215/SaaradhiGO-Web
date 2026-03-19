import api from '../lib/api';

const getData = (res: any) => res.data?.data || res.data;

export const saveFavoriteLocation = async (address_text: string, latitude: number, longitude: number) => {
  const response = await api.post('/rider/locations/', { address_text, latitude, longitude });
  return getData(response);
};

export const getFavoriteLocations = async () => {
  const response = await api.get('/rider/locations/all/');
  return getData(response);
};

export const getNearbyDrivers = async (lat: number, lng: number, radius: number = 1000) => {
  const response = await api.get('/rider/nearby/', {
    params: { lat, lng, radius }
  });
  return getData(response);
};

export const getNotifications = async () => {
  const response = await api.get('/rider/notifications/');
  return response.data; // Paginated response usually returned directly
};
