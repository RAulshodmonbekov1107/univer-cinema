import axiosInstance from './axiosConfig';

// Define the GalleryItem interface to match the actual API response
export interface GalleryItem {
  id: string;
  image_url: string;
  caption_kg?: string;
  caption_ru?: string;
  created_at: string;
  category?: string;
  // Additional fields to maintain compatibility with existing code
  title_kg?: string;
  title_ru?: string;
  description_kg?: string;
  description_ru?: string;
  image?: string;
}

// Function to fetch gallery items from the API
export const getGallery = async (): Promise<GalleryItem[]> => {
  const apiUrl = '/gallery/';
  console.log(`Fetching gallery items from ${apiUrl}`);
  
  try {
    const response = await axiosInstance.get(apiUrl);
    console.log('Gallery API response:', response);
    
    if (!response?.data) {
      console.error('Gallery API returned no data');
      return [];
    }
    
    // Check if response is an array or has results property
    let galleryItems: GalleryItem[] = [];
    
    if (Array.isArray(response.data)) {
      galleryItems = response.data;
      console.log('Gallery API returned array with', galleryItems.length, 'items');
    } else if (response.data.results && Array.isArray(response.data.results)) {
      galleryItems = response.data.results;
      console.log('Gallery API returned paginated results with', galleryItems.length, 'items');
    } else {
      console.error('Unexpected gallery API response format:', response.data);
      return [];
    }
    
    return galleryItems;
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    throw error;
  }
};

export const getGalleryItem = async (id: string): Promise<GalleryItem | null> => {
  try {
    const response = await axiosInstance.get(`/gallery/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching gallery item ${id}:`, error);
    return null;
  }
};

export const galleryService = {
  getGallery,
  getGalleryItem,
};

export default galleryService; 