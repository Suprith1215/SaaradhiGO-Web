import api from '../lib/api';

const getData = (res: any) => res.data?.data || res.data;

export const estimateFare = async (data: {
  pickup_lat: number,
  pickup_long: number,
  destination_lat: number,
  destination_long: number,
  distance_km: number,
  duration_min: number,
  vehicle_type: string
}) => {
  const response = await api.post('/ride/estimate-fare/', data);
  return getData(response);
};

export const getTripDetails = async (trip_id: string | number) => {
  const response = await api.get(`/ride/trip/${trip_id}/`);
  return getData(response);
};

export const rateTrip = async (trip_id: number, score: number, comments?: string) => {
  const response = await api.post('/ride/rate-trip/', { trip_id, score, comments });
  return getData(response);
};

// --- Section 3.5 Payments ---

export const createPaymentOrder = async (trip_id: number) => {
  const response = await api.post('/payments/create-order/', { trip_id });
  return getData(response);
};

export const verifyPaymentSignature = async (paymentData: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}) => {
  const response = await api.post('/payments/verify/', paymentData);
  return getData(response);
};

export const getMyRides = async () => {
    const response = await api.get('/ride/history/');
    return getData(response);
};

export const getAdminRides = async () => {
    const response = await api.get('/ride/admin/');
    return getData(response);
};

export const getAdminStats = async () => {
    const response = await api.get('/auth/dashboard/'); // Assuming dashboard endpoint returns stats
    return getData(response);
};

