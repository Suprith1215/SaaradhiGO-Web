import api from '../lib/api';

const getData = (res: any) => res.data?.data || res.data;

export const getAllUsers = async (params?: { role?: string, is_active?: boolean, page?: number, page_size?: number }) => {
  const response = await api.get('/auth/admin/users/', { params });
  return response.data; // Paginated results
};

export const getDrivers = async (params?: { approved?: boolean, status?: string, page?: number, page_size?: number }) => {
  const response = await api.get('/driver/admin/', { params });
  return response.data; // Paginated results
};

export const getDriverDetails = async (id: string | number) => {
  const response = await api.get(`/driver/admin/${id}/`);
  return getData(response);
};

export const updateDriverKyc = async (id: string | number, data: { approved: boolean, status: string }) => {
  const response = await api.patch(`/driver/admin/${id}/update-kyc/`, data);
  return getData(response);
};

export const deleteDriver = async (id: string | number) => {
  const response = await api.delete(`/driver/admin/${id}/delete/`);
  return getData(response);
};

export const getAllTrips = async (params?: { status?: string, driver_id?: number, user_id?: number, page?: number, page_size?: number }) => {
  const response = await api.get('/ride/admin/trips/', { params });
  return response.data; // Paginated results
};

export const getLiveLocations = async () => {
  const response = await api.get('/ride/admin/live-locations/');
  return getData(response);
};

export const getAllPayments = async (params?: { status?: string, method?: string, page?: number, page_size?: number }) => {
  const response = await api.get('/payments/admin/payments/', { params });
  return response.data; // Paginated results
};

export const getAllTransactions = async (params?: { status?: string, page?: number, page_size?: number }) => {
  const response = await api.get('/payments/admin/transactions/', { params });
  return response.data; // Paginated results
};
