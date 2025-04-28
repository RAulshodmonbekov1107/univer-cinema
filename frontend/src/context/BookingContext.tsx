import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Seat {
  id: number;
  row: string;
  number: number;
  type: string;
  price: number;
}

export interface SnackCartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface BookingData {
  movieId?: number;
  movieTitle?: string;
  moviePoster?: string;
  showtime?: string;
  date?: string;
  hall?: string;
  seats?: Seat[];
  snacks?: SnackCartItem[];
  totalPrice?: number;
  snacksPrice?: number;
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookingData, setBookingData] = useState<BookingData>({});

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prevData => {
      const newData = { ...prevData, ...data };
      
      // Calculate total price whenever seats or snacks change
      let total = 0;
      
      // Add seat prices
      if (newData.seats && newData.seats.length > 0) {
        total += newData.seats.reduce((sum, seat) => sum + seat.price, 0);
      }
      
      // Add snacks prices
      let snacksTotal = 0;
      if (newData.snacks && newData.snacks.length > 0) {
        snacksTotal = newData.snacks.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        total += snacksTotal;
      }
      
      newData.totalPrice = total;
      newData.snacksPrice = snacksTotal;
      
      // Save to localStorage for persistence
      localStorage.setItem('bookingData', JSON.stringify(newData));
      
      return newData;
    });
  };

  const clearBookingData = () => {
    setBookingData({});
    localStorage.removeItem('bookingData');
  };

  // Load from localStorage on initial render
  React.useEffect(() => {
    const savedData = localStorage.getItem('bookingData');
    if (savedData) {
      try {
        setBookingData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing booking data from localStorage:', error);
        localStorage.removeItem('bookingData');
      }
    }
  }, []);

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, clearBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext; 