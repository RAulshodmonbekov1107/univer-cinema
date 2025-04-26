import axiosInstance from './axiosConfig';

export interface News {
  id: string;
  title_kg: string;
  title_ru: string;
  content_kg: string;
  content_ru: string;
  image: string;
  published: boolean;
  created_at: string;
}

export const newsService = {
  getNews: async () => {
    const response = await axiosInstance.get('/news/');
    return response.data;
  },
  
  getNewsItem: async (id: string) => {
    const response = await axiosInstance.get(`/news/${id}/`);
    return response.data;
  }
}; 