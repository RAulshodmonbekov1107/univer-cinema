import axiosInstance from './axiosConfig';

export interface Showtime {
  id: string;
  movie: string;
  movie_title_kg: string;
  movie_title_ru: string;
  hall: string;
  hall_name: string;
  datetime: string;
  language: string;
  price: number;
}

export interface SeatAvailability {
  showtime: Showtime;
  hall_layout: any;
  booked_seats: any[];
}

export const showtimeService = {
  getShowtimes: async (params?: any) => {
    const response = await axiosInstance.get('/showtimes/', { params });
    return response.data;
  },
  
  getShowtime: async (id: string) => {
    const response = await axiosInstance.get(`/showtimes/${id}/`);
    return response.data;
  },
  
  getShowtimesByMovie: async (movieId: string) => {
    const response = await axiosInstance.get('/showtimes/', { 
      params: { movie: movieId } 
    });
    return response.data;
  },
  
  getShowtimesByDate: async (date: string) => {
    const response = await axiosInstance.get('/showtimes/', { 
      params: { date } 
    });
    return response.data;
  },
  
  getAvailableSeats: async (showtimeId: string) => {
    const response = await axiosInstance.get(`/showtimes/${showtimeId}/seats/`);
    return response.data;
  }
}; 