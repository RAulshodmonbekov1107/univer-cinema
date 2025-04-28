import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define interfaces
export interface Seat {
  id: string;
  row: number;
  number: number;
  price: number;
  status: 'available' | 'occupied' | 'selected';
}

export interface Snack {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
}

export interface CartItem {
  snack: Snack;
  quantity: number;
}

interface ShowtimeInfo {
  movieId: number;
  movieTitle: string;
  posterUrl: string;
  date: string;
  time: string;
  hallId: number;
  hallName: string;
}

interface BookingContextType {
  // Showtime information
  showtimeInfo: ShowtimeInfo | null;
  setShowtimeInfo: React.Dispatch<React.SetStateAction<ShowtimeInfo | null>>;
  
  // Seats management
  selectedSeats: Seat[];
  addSeat: (seat: Seat) => void;
  removeSeat: (seat: Seat) => void;
  clearSeats: () => void;
  
  // Snacks management
  cartItems: CartItem[];
  addToCart: (snack: Snack) => void;
  removeFromCart: (snackId: number) => void;
  updateCartItemQuantity: (snackId: number, quantity: number) => void;
  clearCart: () => void;
  
  // Booking step
  currentStep: 'seats' | 'snacks' | 'payment' | 'confirmation';
  setCurrentStep: React.Dispatch<React.SetStateAction<'seats' | 'snacks' | 'payment' | 'confirmation'>>;
  
  // Calculate totals
  getTotalSeatsPrice: () => number;
  getTotalSnacksPrice: () => number;
  getTotalPrice: () => number;
  
  // New booking process
  startNewBooking: () => void;
  
  // Step navigation
  goToStep: (step: 'seats' | 'snacks' | 'payment' | 'confirmation') => void;
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
  const [showtimeInfo, setShowtimeInfo] = useState<ShowtimeInfo | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<'seats' | 'snacks' | 'payment' | 'confirmation'>('seats');

  // Load cart items from localStorage on initial load
  useEffect(() => {
    try {
      const savedCartItems = localStorage.getItem('cartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      }
    } catch (error) {
      console.error('Error loading cart items from localStorage:', error);
    }
  }, []);

  const addSeat = (seat: Seat) => {
    setSelectedSeats(prev => [...prev, seat]);
  };

  const removeSeat = (seat: Seat) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const addToCart = (snack: Snack) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.snack.id === snack.id
    );

    if (existingItemIndex !== -1) {
      // Item already in cart, increase quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // New item, add to cart with quantity 1
      setCartItems([...cartItems, { snack, quantity: 1 }]);
    }
  };

  const removeFromCart = (snackId: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.snack.id === snackId
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      
      if (updatedCartItems[existingItemIndex].quantity > 1) {
        // Decrease quantity if more than one
        updatedCartItems[existingItemIndex].quantity -= 1;
      } else {
        // Remove item if quantity is 1
        updatedCartItems.splice(existingItemIndex, 1);
      }
      
      setCartItems(updatedCartItems);
    }
  };

  const updateCartItemQuantity = (snackId: number, quantity: number) => {
    if (quantity < 1) return;
    
    const existingItemIndex = cartItems.findIndex(
      (item) => item.snack.id === snackId
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity = quantity;
      setCartItems(updatedCartItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // Function to start a new booking process
  const startNewBooking = () => {
    setSelectedSeats([]);
    clearCart();
    setCurrentStep('seats');
    // Also clear localStorage items related to booking
    localStorage.removeItem('cartItems');
    localStorage.removeItem('bookingData');
  };

  const goToStep = (step: 'seats' | 'snacks' | 'payment' | 'confirmation') => {
    setCurrentStep(step);
  };

  const getTotalSeatsPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const getTotalSnacksPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.snack.price * item.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return getTotalSeatsPrice() + getTotalSnacksPrice();
  };

  const value: BookingContextType = {
    showtimeInfo,
    setShowtimeInfo,
    selectedSeats,
    addSeat,
    removeSeat,
    clearSeats,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    startNewBooking,
    currentStep,
    setCurrentStep,
    goToStep,
    getTotalSeatsPrice,
    getTotalSnacksPrice,
    getTotalPrice
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext; 