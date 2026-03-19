import api from '../lib/api';

const getData = (res: any) => res.data?.data || res.data;

const LOCAL_DRIVERS_KEY = 'saaradhigo_pending_drivers';

export const updateDriverProfile = async (data: { active_vehicle?: number }) => {
  const response = await api.patch('/driver/driver/', data);
  return getData(response);
};

export const getEarningsSummary = async () => {
  const response = await api.get('/driver/earnings/summary/');
  return getData(response);
};

export const addVehicle = async (vehicleData: {
  vehicle_number: string,
  vehicle_type: string,
  brand: string,
  model: string,
  color: string,
  year: number,
  capacity: number
}) => {
  const response = await api.post('/driver/vehicles/add/', vehicleData);
  return getData(response);
};

export const registerDriver = async (data: any) => {
    // Store locally for simulation
    const existing = JSON.parse(localStorage.getItem(LOCAL_DRIVERS_KEY) || '[]');
    const newDriver = {
      ...data,
      id: data.id || `drv_${Math.floor(Math.random() * 10000)}`,
      registered_at: new Date().toLocaleString(),
      status: 'pending'
    };
    const filtered = existing.filter((d: any) => d.phone_number !== data.phone_number);
    filtered.push(newDriver);
    localStorage.setItem(LOCAL_DRIVERS_KEY, JSON.stringify(filtered));

    try {
        if (data.vehicle_number) {
            await addVehicle({
                vehicle_number: data.vehicle_number,
                vehicle_type: data.vehicle_type || 'car',
                brand: data.brand || 'Unknown',
                model: data.model || 'Unknown',
                color: data.color || 'Unknown',
                year: data.year || 2024,
                capacity: data.capacity || 4
            });
        }
        return await updateDriverProfile(data);
    } catch (e) {
        return newDriver;
    }
};
