import axios from 'axios';

// Define the GalleryItem interface
export interface GalleryItem {
  id: string;
  title_kg: string;
  title_ru: string;
  description_kg: string;
  description_ru: string;
  image: string;
  category: string;
  created_at: string;
}

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Function to fetch gallery items from the API
export const getGallery = async (): Promise<GalleryItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/gallery`);
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

export const galleryService = {
  getGallery: async () => {
    const response = await axios.get(`${API_URL}/gallery`);
    return response.data;
  },
  
  getGalleryItem: async (id: string) => {
    const response = await axios.get(`${API_URL}/gallery/${id}`);
    return response.data;
  }
}; 