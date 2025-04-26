import axiosInstance from './axiosConfig';

export interface Snack {
  id: string;
  name_kg: string;
  name_ru: string;
  price: number;
  image: string;
  available: boolean;
}

export const snackService = {
  getSnacks: async () => {
    const response = await axiosInstance.get('/snacks/');
    return response.data;
  },
  
  getSnack: async (id: string) => {
    const response = await axiosInstance.get(`/snacks/${id}/`);
    return response.data;
  }
}; 