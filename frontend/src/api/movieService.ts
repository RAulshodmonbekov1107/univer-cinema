import axiosInstance from './axiosConfig';

export interface Movie {
  id: string;
  title_kg: string;
  title_ru: string;
  synopsis_kg: string;
  synopsis_ru: string;
  trailer: string;
  genre: string;
  language: string;
  duration: number;
  poster: string;
  poster_url?: string;
  release_date: string;
  is_showing: boolean;
}

export const movieService = {
  getMovies: async (params?: any) => {
    const response = await axiosInstance.get('/movies/', { params });
    return response.data;
  },
  
  getMovie: async (id: string) => {
    const response = await axiosInstance.get(`/movies/${id}/`);
    return response.data;
  },
  
  getNowShowing: async () => {
    const response = await axiosInstance.get('/movies/', { 
      params: { showing: true } 
    });
    return response.data;
  },
  
  getComingSoon: async () => {
    const response = await axiosInstance.get('/movies/', { 
      params: { showing: false } 
    });
    return response.data;
  },
  
  getMoviesByGenre: async (genre: string) => {
    const response = await axiosInstance.get('/movies/', { 
      params: { genre } 
    });
    return response.data;
  },
  
  searchMovies: async (query: string) => {
    const response = await axiosInstance.get('/movies/', { 
      params: { search: query } 
    });
    return response.data;
  }
}; 