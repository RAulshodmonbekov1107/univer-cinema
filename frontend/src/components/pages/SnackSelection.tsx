import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import './SnackSelection.css';

interface SnackCategory {
  id: number;
  name: string;
}

const SnackSelection: React.FC = () => {
  const navigate = useNavigate();
  const { 
    showtimeInfo, 
    selectedSeats,
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateCartItemQuantity,
    goToStep,
    getTotalSeatsPrice,
    getTotalSnacksPrice,
    getTotalPrice
  } = useBooking();

  // Using const instead of useState to avoid unused setter
  const categories: SnackCategory[] = [
    { id: 1, name: 'Popcorn' },
    { id: 2, name: 'Drinks' },
    { id: 3, name: 'Snacks' },
    { id: 4, name: 'Combos' }
  ];
  
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Using const instead of useState for static mock data
  const snacks = [
    {
      id: 1,
      name: 'Small Popcorn',
      description: 'Classic buttered popcorn',
      price: 150,
      image: '/images/snacks/small-popcorn.jpg',
      categoryId: 1
    },
    {
      id: 2,
      name: 'Medium Popcorn',
      description: 'Classic buttered popcorn',
      price: 200,
      image: '/images/snacks/medium-popcorn.jpg',
      categoryId: 1
    },
    {
      id: 3,
      name: 'Large Popcorn',
      description: 'Classic buttered popcorn',
      price: 250,
      image: '/images/snacks/large-popcorn.jpg',
      categoryId: 1
    },
    {
      id: 4,
      name: 'Caramel Popcorn',
      description: 'Sweet caramel flavor',
      price: 280,
      image: '/images/snacks/caramel-popcorn.jpg',
      categoryId: 1
    },
    {
      id: 5,
      name: 'Coca-Cola Small',
      description: 'Refreshing soda',
      price: 120,
      image: '/images/snacks/coke-small.jpg',
      categoryId: 2
    },
    {
      id: 6,
      name: 'Coca-Cola Medium',
      description: 'Refreshing soda',
      price: 180,
      image: '/images/snacks/coke-medium.jpg',
      categoryId: 2
    },
    {
      id: 7,
      name: 'Mineral Water',
      description: '500ml bottled water',
      price: 80,
      image: '/images/snacks/water.jpg',
      categoryId: 2
    },
    {
      id: 8,
      name: 'Nachos',
      description: 'With cheese sauce',
      price: 220,
      image: '/images/snacks/nachos.jpg',
      categoryId: 3
    },
    {
      id: 9,
      name: 'Chocolate Bar',
      description: 'Sweet treat',
      price: 100,
      image: '/images/snacks/chocolate.jpg',
      categoryId: 3
    },
    {
      id: 10,
      name: 'Combo #1',
      description: 'Large popcorn + 2 drinks',
      price: 400,
      image: '/images/snacks/combo1.jpg',
      categoryId: 4
    },
    {
      id: 11,
      name: 'Combo #2',
      description: 'Medium popcorn + drink + snack',
      price: 450,
      image: '/images/snacks/combo2.jpg',
      categoryId: 4
    }
  ];

  useEffect(() => {
    // Check if we have showtime info and selected seats
    if (!showtimeInfo || selectedSeats.length === 0) {
      // Try to get booking data from localStorage as fallback
      const storedBookingData = localStorage.getItem('bookingData');
      if (storedBookingData) {
        try {
          const parsedData = JSON.parse(storedBookingData);
          // If we have valid booking data but no context data, 
          // we can continue to display the snack selection
          console.log('Retrieved booking data from localStorage:', parsedData);
        } catch (error) {
          console.error('Error parsing booking data:', error);
          navigate('/booking');
        }
      } else {
        // No data in context or localStorage, go back to booking
        navigate('/booking');
      }
    }
    
    // In a real app, load snacks and categories from API
    // Example: fetchSnacks();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [showtimeInfo, selectedSeats, navigate]);

  const getSnackQuantity = (snackId: number): number => {
    const item = cartItems.find(item => item.snack.id === snackId);
    return item ? item.quantity : 0;
  };

  const handleAddSnack = (snack: any) => {
    addToCart(snack);
  };

  const handleRemoveSnack = (snackId: number) => {
    removeFromCart(snackId);
  };

  // This function is available but currently not used in the UI
  // It's kept for potential future use in quantity inputs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpdateQuantity = (snackId: number, newQuantity: number) => {
    updateCartItemQuantity(snackId, newQuantity);
  };

  const handleContinue = () => {
    // Save cart items to localStorage if there are any
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      // Ensure we remove any existing cart items if the user proceeded with no snacks
      localStorage.removeItem('cartItems');
    }
    
    // Get the booking data from localStorage
    const storedBookingData = localStorage.getItem('bookingData');
    if (storedBookingData) {
      try {
        const bookingData = JSON.parse(storedBookingData);
        
        // Calculate snack total
        const snackTotal = cartItems.reduce((total, item) => 
          total + (item.snack.price * item.quantity), 0);
        
        // Update the booking data with snack information
        if (cartItems.length > 0) {
          bookingData.snackOrders = cartItems;
          bookingData.snackTotal = snackTotal;
          bookingData.totalPrice = bookingData.totalPrice + snackTotal;
        } else {
          // Ensure we don't have any snack data if user didn't select any
          delete bookingData.snackOrders;
          delete bookingData.snackTotal;
        }
        
        // Save the updated booking data back to localStorage
        localStorage.setItem('bookingData', JSON.stringify(bookingData));
      } catch (error) {
        console.error('Error updating booking data with snacks:', error);
      }
    }
    
    goToStep('payment');
    navigate('/booking-confirmation');
  };

  const handleBack = () => {
    goToStep('seats');
    navigate('/booking');
  };

  if (isLoading) {
    return (
      <div className="snack-selection-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="snack-selection-container">
      <div className="snack-selection-header">
        <h1>Select Snacks</h1>
        <div className="snack-selection-actions">
          <button onClick={handleBack} className="btn-secondary">Back to Seats</button>
          <button onClick={handleContinue} className="btn-primary">Continue to Payment</button>
        </div>
      </div>

      {showtimeInfo && (
        <div className="movie-info">
          <div className="movie-details">
            <h2>{showtimeInfo.movieTitle}</h2>
            <p>
              {showtimeInfo.date} | {showtimeInfo.time} | {showtimeInfo.hallName}
            </p>
            <p>Selected seats: {selectedSeats.map(seat => `${seat.row}-${seat.number}`).join(', ')}</p>
          </div>
          <div className="booking-summary">
            <div className="summary-item">
              <span>Tickets ({selectedSeats.length})</span>
              <span>{getTotalSeatsPrice()} som</span>
            </div>
            {cartItems.length > 0 && (
              <div className="summary-item">
                <span>Snacks</span>
                <span>{getTotalSnacksPrice()} som</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>{getTotalPrice()} som</span>
            </div>
          </div>
        </div>
      )}

      <div className="snack-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="snacks-grid">
        {snacks
          .filter(snack => snack.categoryId === activeCategory)
          .map(snack => (
            <div key={snack.id} className="snack-card">
              <div className="snack-image">
                <img src={snack.image} alt={snack.name} onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/snacks/placeholder.jpg';
                }} />
              </div>
              <div className="snack-details">
                <h3>{snack.name}</h3>
                <p>{snack.description}</p>
                <div className="snack-price">{snack.price} som</div>
                <div className="snack-actions">
                  {getSnackQuantity(snack.id) > 0 ? (
                    <div className="quantity-control">
                      <button onClick={() => handleRemoveSnack(snack.id)}>-</button>
                      <span>{getSnackQuantity(snack.id)}</span>
                      <button onClick={() => handleAddSnack(snack)}>+</button>
                    </div>
                  ) : (
                    <button 
                      className="add-to-cart" 
                      onClick={() => handleAddSnack(snack)}
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h2>Your Order</h2>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.snack.id} className="cart-item">
                <div className="cart-item-info">
                  <span>{item.snack.name}</span>
                  <span>{item.quantity} × {item.snack.price} som</span>
                </div>
                <div className="cart-item-total">
                  {item.quantity * item.snack.price} som
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="snack-selection-footer">
        <button onClick={handleBack} className="btn-secondary">Back</button>
        <button onClick={handleContinue} className="btn-primary">Continue to Payment</button>
      </div>
    </div>
  );
};

export default SnackSelection; 