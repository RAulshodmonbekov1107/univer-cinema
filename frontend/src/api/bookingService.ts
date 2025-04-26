import axiosInstance from './axiosConfig';

export interface SnackOrder {
  snack: string;
  quantity: number;
}

// Define the seat format expected by the backend
export interface SeatForBooking {
  row: string;
  number: number;
}

export interface BookingRequest {
  showtime: string;
  seats_json: SeatForBooking[];
  snack_orders?: SnackOrder[];
  snack_total: number;
  ticket_total: number;
}

export interface Booking {
  id: string;
  user: string;
  showtime: string;
  movie_title_kg: string;
  movie_title_ru: string;
  datetime: string;
  hall_name: string;
  seats_json: any[];
  snack_total: number;
  ticket_total: number;
  grand_total: number;
  status: string;
  qr_code: string | null;
  snack_orders: any[];
}

export const bookingService = {
  getBookings: async () => {
    const response = await axiosInstance.get('/bookings/');
    return response.data;
  },
  
  getBooking: async (id: string) => {
    const response = await axiosInstance.get(`/bookings/${id}/`);
    return response.data;
  },
  
  createBooking: async (booking: BookingRequest) => {
    const response = await axiosInstance.post('/bookings/', booking);
    return response.data;
  },
  
  cancelBooking: async (id: string) => {
    const response = await axiosInstance.patch(`/bookings/${id}/`, {
      status: 'cancelled'
    });
    return response.data;
  }
}; 