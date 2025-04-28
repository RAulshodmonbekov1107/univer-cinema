import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle, FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaApple, FaDownload } from 'react-icons/fa';
import { Seat } from '../pages/Booking';
import { authService } from '../../api/authService';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import './BookingConfirmation.css';

// Snack interface for cart items
interface Snack {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
}

interface CartItem {
  snack: Snack;
  quantity: number;
}

// Seat price constant
const SEAT_PRICE = 180;

// Update the BookingData interface to include snacks
interface BookingData {
  movieId: string;
  movieTitle: string;
  poster: string;
  selectedSeats: Seat[];
  totalPrice: number;
  date: string;
  time: string;
  hall: string;
  format: string;
  showtimeId: string;
  snackOrders?: CartItem[]; // Optional because older bookings might not have it
  snackTotal?: number; // Optional total for snacks
}

const BookingConfirmation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State hooks
  const [loading, setLoading] = useState<boolean>(true);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is authenticated
    setIsAuthenticated(authService.isAuthenticated());
    
    // Clear any existing cart items from localStorage to prevent persistence between bookings
    // This ensures we don't accidentally display snacks from previous bookings
    localStorage.removeItem('cartItems');
    
    try {
      // Retrieve booking data from localStorage
      const storedBookingData = localStorage.getItem('bookingData');
      const savedParamsStr = localStorage.getItem('currentShowtimeParams');
      let savedParams = null;
      
      // Get snack cart data if available
      let snackOrders: CartItem[] = [];
      
      try {
        const cartItemsStr = localStorage.getItem('cartItems');
        console.log('DEBUG - Cart items from localStorage:', cartItemsStr);
        
        if (cartItemsStr) {
          snackOrders = JSON.parse(cartItemsStr);
          console.log('DEBUG - Parsed cart items:', snackOrders);
          
          // Only count snack orders if they actually exist and have items
          if (snackOrders && snackOrders.length > 0) {
            // Check for medium popcorn
            const hasMediumPopcorn = snackOrders.some(item => 
              item.snack.name.toLowerCase().includes('medium') && 
              item.snack.name.toLowerCase().includes('popcorn')
            );
            console.log('DEBUG - Has medium popcorn?', hasMediumPopcorn);
          } else {
            // Reset snack orders if empty array
            snackOrders = [];
          }
        } else {
          console.log('DEBUG - No cart items found in localStorage');
          // Ensure these are empty if no cart items
          snackOrders = [];
        }
      } catch (e) {
        console.error('Error parsing snack cart data:', e);
        // Ensure these are empty if error parsing
        snackOrders = [];
      }
      
      // Try to parse saved showtime params if available
      if (savedParamsStr) {
        try {
          savedParams = JSON.parse(savedParamsStr);
        } catch (e) {
          console.error('Error parsing saved showtime params:', e);
        }
      }
      
      if (!storedBookingData) {
        console.error('No booking data found in localStorage');
        setError(t('booking.dataNotFound'));
        setLoading(false);
        return;
      }

      // Parse the booking data
      let parsedData: BookingData;
      try {
        parsedData = JSON.parse(storedBookingData) as BookingData;
        
        // Check if booking data already has snack orders
        if (parsedData.snackOrders && parsedData.snackOrders.length > 0) {
          console.log('DEBUG - Booking data already has snack orders:', parsedData.snackOrders);
        } else {
          console.log('DEBUG - No snack orders in booking data');
          // Explicitly remove snack orders from parsed data if not present
          delete parsedData.snackOrders;
          delete parsedData.snackTotal;
        }
      } catch (e) {
        console.error('Error parsing booking data:', e);
        setError(t('booking.dataNotFound'));
        setLoading(false);
        return;
      }
      
      // Log the parsed data to debug
      console.log("Loaded booking data:", parsedData);
      
      // Create a complete object with fallbacks for all required fields
      const completeData: BookingData = {
        movieId: parsedData.movieId || (savedParams?.movie || 'unknown'),
        movieTitle: parsedData.movieTitle || (savedParams?.title || 'Unknown Title'),
        poster: parsedData.poster || (savedParams?.poster || '/images/movies/default-poster.jpg'),
        selectedSeats: parsedData.selectedSeats || [],
        totalPrice: parsedData.totalPrice || (parsedData.selectedSeats?.length * (savedParams?.price || SEAT_PRICE) || 0),
        date: parsedData.date || (savedParams?.date || new Date().toLocaleDateString()),
        time: parsedData.time || (savedParams?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        hall: parsedData.hall || (savedParams?.hall || 'Main Hall'),
        format: parsedData.format || (savedParams?.format || '2D'),
        showtimeId: parsedData.showtimeId || (savedParams?.id || 'unknown'),
      };
      
      // Only add snack data if it actually exists in the parsed data
      // This prevents inheriting snack data from previous bookings
      if (parsedData.snackOrders && parsedData.snackOrders.length > 0) {
        completeData.snackOrders = parsedData.snackOrders;
        completeData.snackTotal = parsedData.snackTotal;
        console.log('DEBUG - Added snack orders from booking data:', completeData.snackOrders);
      }
      
      // Verify that we have at least some seats selected
      if (!completeData.selectedSeats || completeData.selectedSeats.length === 0) {
        console.error('No seats selected in booking data');
        setError(t('booking.incompleteData'));
        setLoading(false);
        return;
      }
      
      // Update total price to include both seats and snacks
      const seatTotal = completeData.selectedSeats.length * (savedParams?.price || SEAT_PRICE);
      // Calculate snack total if snack orders exist
      if (completeData.snackOrders && completeData.snackOrders.length > 0) {
        const snackTotal = completeData.snackOrders.reduce((total, item) => 
          total + (item.quantity * item.snack.price), 0);
        completeData.snackTotal = snackTotal;
        completeData.totalPrice = seatTotal + snackTotal;
      } else {
        completeData.totalPrice = seatTotal;
      }
      
      // Final check for snack orders - log what we're actually using
      if (completeData.snackOrders && completeData.snackOrders.length > 0) {
        console.log('DEBUG - Final data has snack orders:', completeData.snackOrders);
      } else {
        console.log('DEBUG - Final booking data has no snack orders');
      }
      
      setBookingData(completeData);
      
      // Generate random confirmation number
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      setConfirmationNumber(`BC-${randomNum}`);
      
      setLoading(false);
    } catch (err) {
      console.error('Error retrieving booking data:', err);
      setError(t('booking.dataNotFound'));
      setLoading(false);
    }
  }, [t]);

  // Format credit card number with spaces
  const formatCardNumber = (input: string): string => {
    const numbers = input.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numbers.length; i += 4) {
      groups.push(numbers.slice(i, i + 4));
    }
    
    return groups.join(' ');
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (input: string): string => {
    const numbers = input.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    }
    
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
  };
  
  // Handle card number input change
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow up to 16 digits (plus spaces)
    if (input.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatCardNumber(input));
    }
    validateForm();
  };
  
  // Handle expiry date input change
  const handleExpiryDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow up to 4 digits (MM/YY format)
    if (input.replace(/\D/g, '').length <= 4) {
      setExpiryDate(formatExpiryDate(input));
    }
    validateForm();
  };
  
  // Handle CVV input change
  const handleCvvChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    // Only allow up to 3 digits
    if (input.length <= 3) {
      setCvv(input);
    }
    validateForm();
  };
  
  // Handle cardholder name input change
  const handleCardholderNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardholderName(e.target.value);
    validateForm();
  };
  
  // Validate form
  const validateForm = () => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isExpiryDateValid = expiryDate.length === 5; // MM/YY format
    const isCvvValid = cvv.length === 3;
    const isNameValid = cardholderName.trim().length > 0;
    
    setIsFormValid(isCardNumberValid && isExpiryDateValid && isCvvValid && isNameValid);
  };

  // Handle payment process
  const handlePayment = async () => {
    if (!bookingData || !isFormValid) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store the current booking data and redirect to login
      localStorage.setItem('redirectAfterLogin', '/booking-confirmation');
      navigate('/login');
      return;
    }
    
    setIsPaying(true);
    
    try {
      // In a real application, we would save the booking to the database
      // For this demo, we'll simulate a successful payment
      console.log('Simulating payment processing...');
      
      // Create a unique confirmation number
      const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      setConfirmationNumber(`BC-${randomId}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Payment successful!');
      setIsPaying(false);
      setPaymentComplete(true);
      
      // Clear booking data after successful payment
      setTimeout(() => {
        localStorage.removeItem('bookingData');
        localStorage.removeItem('currentShowtimeParams'); // Also clear saved showtime parameters
      }, 2000);
    } catch (error: any) {
      console.error('Error processing payment:', error);
      setError(t('booking.paymentFailed'));
      setIsPaying(false);
    }
  };

  // Handle return to home
  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner fullScreen text={t('common.loading')} />;
  }

  if (error) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-content text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{t('booking.error')}</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Button 
              variant="primary"
              onClick={handleReturnHome}
            >
              {t('common.backToHome')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    // Function to generate and download a ticket
    const handleDownloadTicket = () => {
      if (!bookingData) return;
      
      // Format today's date
      const today = new Date();
      const formattedPurchaseDate = today.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
      
      // Format seats for display
      const formattedSeats = bookingData.selectedSeats.map(seat => 
        `Row ${seat.row}, Seat ${seat.seatNumber}`
      ).join('</span><span class="seat-tag">');
      
      // Create ticket content as HTML for better formatting
      const ticketHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ticket ${confirmationNumber}</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    .ticket-container {
      max-width: 800px;
      margin: 20px auto;
      background-color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      border-radius: 12px;
      overflow: hidden;
    }
    .ticket-header {
      background: linear-gradient(135deg, #D32F2F, #880E4F);
      color: white;
      padding: 25px;
      text-align: center;
      position: relative;
    }
    .cinema-name {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
      letter-spacing: 1px;
    }
    .ticket-title {
      font-size: 18px;
      margin: 10px 0 0;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .ticket-body {
      padding: 30px;
      display: flex;
    }
    .ticket-info {
      flex: 3;
      padding-right: 30px;
    }
    .movie-poster-img {
      width: 100px;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
      float: right;
      margin-left: 15px;
      margin-bottom: 15px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    .ticket-qr {
      flex: 1;
      text-align: center;
      border-left: 2px dashed #ddd;
      padding-left: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .confirmation-number {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #D32F2F;
      border: 2px solid #D32F2F;
      display: inline-block;
      padding: 8px 15px;
      border-radius: 6px;
    }
    .movie-title {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 20px;
      color: #212121;
    }
    .info-group {
      margin-bottom: 25px;
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 15px;
    }
    .info-group-title {
      font-weight: bold;
      margin-bottom: 12px;
      color: #555;
      font-size: 16px;
      text-transform: uppercase;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    .info-row {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
    }
    .info-label {
      font-weight: bold;
      width: 130px;
      color: #555;
    }
    .info-value {
      flex: 1;
      color: #212121;
    }
    .seats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }
    .seat-tag {
      background-color: #E3F2FD;
      color: #0D47A1;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #BBDEFB;
    }
    .ticket-footer {
      padding: 20px 30px;
      background-color: #f9f9f9;
      font-size: 14px;
      color: #666;
      text-align: center;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #eee;
      margin-top: 20px;
      padding-top: 20px;
      font-weight: bold;
    }
    .price-value {
      color: #D32F2F;
      font-size: 22px;
    }
    .qr-code {
      margin-bottom: 15px;
      width: 160px;
      height: 160px;
    }
    .tear-line {
      text-align: center;
      padding: 8px 0;
      font-size: 20px;
      color: #888;
      letter-spacing: 2px;
    }
    .qr-instruction {
      font-size: 14px;
      color: #555;
      margin-top: 15px;
      max-width: 200px;
      text-align: center;
      line-height: 1.4;
    }
    .purchase-info {
      font-size: 13px;
      color: #757575;
      margin-top: 10px;
    }
    .purchase-info span {
      font-weight: bold;
    }
    @media print {
      body {
        background-color: white;
      }
      .ticket-container {
        box-shadow: none;
      }
      .tear-line {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <div class="ticket-header">
      <h1 class="cinema-name">Univer Cinema</h1>
      <p class="ticket-title">E-Ticket</p>
    </div>
    
    <div class="tear-line">✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ✂</div>
    
    <div class="ticket-body">
      <div class="ticket-info">
        <div class="confirmation-number">${confirmationNumber}</div>
        <h2 class="movie-title">
          ${bookingData.movieTitle}
          <img 
            src="${bookingData.poster || "https://placehold.co/400x600/333/FFF?text=Movie"}" 
            class="movie-poster-img"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              if (e.currentTarget) {
                console.log("Failed to load image:", bookingData.poster);
                // Try to get a placeholder image from Unsplash
                e.currentTarget.src = 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
                
                // If that also fails, try a more reliable placeholder
                e.currentTarget.onerror = function(this: HTMLImageElement) {
                  console.log("Failed to load Unsplash fallback image");
                  this.src = 'https://placehold.co/400x600/333/FFF?text=Movie';
                  // Prevent infinite loop
                  this.onerror = null;
                };
              }
            }}
            alt="${bookingData.movieTitle}"
          />
        </h2>
        
        <div class="info-group">
          <div class="info-group-title">Movie Details</div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${bookingData.date}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Time:</span>
            <span class="info-value">${bookingData.time}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Hall:</span>
            <span class="info-value">${bookingData.hall}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Format:</span>
            <span class="info-value">${bookingData.format}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Duration:</span>
            <span class="info-value">127 min</span>
          </div>
        </div>
        
        <div class="info-group">
          <div class="info-group-title">Ticket Details</div>
          <div class="info-row">
            <span class="info-label">Ticket Holder:</span>
            <span class="info-value">${cardholderName || 'Guest'}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tickets:</span>
            <span class="info-value">${bookingData.selectedSeats.length}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Seats:</span>
            <div class="seats-container">
              <span class="seat-tag">${formattedSeats}</span>
            </div>
          </div>
        </div>
        
        ${bookingData.snackOrders && bookingData.snackOrders.length > 0 ? `
        <div class="info-group">
          <div class="info-group-title">Snack Orders</div>
          ${bookingData.snackOrders.map(item => `
            <div class="info-row">
              <span class="info-label">${item.snack.name}:</span>
              <span class="info-value">${item.quantity} × ${item.snack.price} сом</span>
            </div>
          `).join('')}
          <div class="info-row total-row">
            <span class="info-label">Snack Total:</span>
            <span class="info-value">${bookingData.snackTotal} сом</span>
          </div>
        </div>
        ` : ''}
        
        <div class="price-row">
          <span class="price-label">Total Price:</span>
          <span class="price-value">${bookingData.totalPrice} сом</span>
        </div>
        
        <div class="purchase-info">
          <p>Purchase Date: <span>${formattedPurchaseDate}</span></p>
        </div>
      </div>
      
      <div class="ticket-qr">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`TC-${confirmationNumber}|SEATS-${bookingData.selectedSeats.length}|DATE-${bookingData.date}`)}" class="qr-code" alt="QR Code" />
        <p class="qr-instruction">Please scan this QR code at the entrance. This ticket is valid for one-time use only.</p>
      </div>
    </div>
    
    <div class="ticket-footer">
      <div>© 2024 Univer Cinema</div>
      <div>Naryn, Kyrgyzstan</div>
    </div>
  </div>
</body>
</html>
      `;
      
      // Create a Blob with the HTML content
      const blob = new Blob([ticketHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open the ticket in a new tab for printing
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          // Add a small delay to ensure the content is loaded properly
          setTimeout(() => {
            newWindow.print();
          }, 500);
        };
      } else {
        // If popup blocked, offer direct download instead
        const link = document.createElement('a');
        link.href = url;
        link.download = `ticket-${confirmationNumber}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Clean up the URL object after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
    };

    return (
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-content text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">{t('booking.paymentSuccess')}</h2>
            <p className="text-lg font-medium mb-2">
              {t('booking.confirmationNumber')}: {confirmationNumber}
            </p>
            <p className="text-gray-700 mb-6">{t('booking.emailSent')}</p>
            
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button 
                variant="primary"
                onClick={handleDownloadTicket}
                className="flex items-center justify-center gap-2"
              >
                <FaDownload />
                {t('booking.downloadTicket')}
              </Button>
              
              <Button 
                variant="secondary"
                onClick={handleReturnHome}
              >
                {t('common.backToHome')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h2>{t('booking.bookingConfirmation')}</h2>
          <div className="confirmation-number">{confirmationNumber}</div>
        </div>
        
        {bookingData && (
          <div className="confirmation-content">
            <div className="movie-details">
              <div className="movie-poster">
                <img
                  src={bookingData.poster || "https://placehold.co/400x600/333/FFF?text=Movie"}
                  alt={bookingData.movieTitle}
                  className="w-full h-auto rounded-lg max-h-64 object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    if (e.currentTarget) {
                      console.log("Failed to load image:", bookingData.poster);
                      // Try to get a placeholder image from Unsplash
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
                      
                      // If that also fails, try a more reliable placeholder
                      e.currentTarget.onerror = function(this: HTMLImageElement) {
                        console.log("Failed to load Unsplash fallback image");
                        this.src = 'https://placehold.co/400x600/333/FFF?text=Movie';
                        // Prevent infinite loop
                        this.onerror = null;
                      };
                    }
                  }}
                />
              </div>
              
              <div className="movie-info">
                <h3 className="movie-title">{bookingData.movieTitle}</h3>
                
                <div className="movie-metadata">
                  <div className="movie-datetime">
                    <span className="font-medium">{t('booking.date')}:</span> {bookingData.date}
                  </div>
                  <div className="movie-datetime">
                    <span className="font-medium">{t('booking.time')}:</span> {bookingData.time}
                  </div>
                  <div className="movie-datetime">
                    <span className="font-medium">{t('booking.hall')}:</span> {bookingData.hall}
                  </div>
                  <div className="movie-datetime">
                    <span className="font-medium">{t('booking.format')}:</span> {bookingData.format}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="seats-details">
              <h3 className="text-xl font-bold mb-3">{t('booking.seatDetails')}</h3>
              <p className="mb-2">
                <span className="font-medium">{t('booking.numberOfTickets')}:</span> {bookingData.selectedSeats.length}
              </p>
              <p className="mb-2">
                <span className="font-medium">{t('booking.pricePerSeat')}:</span> {SEAT_PRICE} {t('common.currency')}
              </p>
              
              <p className="font-medium mb-2">{t('booking.selectedSeats')}:</p>
              <div className="seats-list">
                {bookingData.selectedSeats.map((seat, index) => (
                  <span
                    key={`seat-${seat.row}-${seat.seatNumber}`}
                    className="seat-tag"
                  >
                    {t('booking.rowSeat', { row: seat.row, seat: seat.seatNumber })}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="price-summary">
              <span>{t('booking.totalPrice')}:</span>
              <span>{bookingData.totalPrice} {t('common.currency')}</span>
            </div>
            
            {/* Display snack orders if they exist */}
            {bookingData.snackOrders && bookingData.snackOrders.length > 0 && (
              <div className="snack-orders">
                <h3 className="text-xl font-bold mb-3">{t('booking.snackOrders')}</h3>
                <div className="snack-items">
                  {bookingData.snackOrders.map((item) => (
                    <div key={item.snack.id} className="snack-item">
                      <div className="snack-item-image">
                        <img 
                          src={item.snack.image || "/images/snacks/popcorn.png"} 
                          alt={item.snack.name}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            if (e.currentTarget) {
                              console.log("Failed to load snack image:", item.snack.image);
                              // Try to get image from public folder first
                              const newSrc = `/images/snacks/${item.snack.name.toLowerCase().replace(/\s+/g, '')}.png`;
                              e.currentTarget.src = newSrc;
                              
                              // If that fails, try matching with existing images
                              e.currentTarget.onerror = function(this: HTMLImageElement) {
                                console.log("Failed to load snack fallback image:", newSrc);
                                // Map to our known snack images
                                let mappedImage = '';
                                if (item.snack.name.toLowerCase().includes('popcorn')) {
                                  if (item.snack.name.toLowerCase().includes('caramel')) {
                                    mappedImage = '/images/snacks/caramelpopcorn.png';
                                  } else {
                                    mappedImage = '/images/snacks/classicpopcorn.png';
                                  }
                                } else if (item.snack.name.toLowerCase().includes('cola') || 
                                          item.snack.name.toLowerCase().includes('coke')) {
                                  mappedImage = '/images/snacks/coca-cola.png';
                                } else if (item.snack.name.toLowerCase().includes('nachos')) {
                                  mappedImage = '/images/snacks/nachoswithcheese.png';
                                } else if (item.snack.name.toLowerCase().includes('combo')) {
                                  if (item.snack.name.toLowerCase().includes('family')) {
                                    mappedImage = '/images/snacks/familycombo.png';
                                  } else {
                                    mappedImage = '/images/snacks/moviecombo.png';
                                  }
                                } else if (item.snack.name.toLowerCase().includes('chocolate')) {
                                  mappedImage = '/images/snacks/bombchocolate.png';
                                } else if (item.snack.name.toLowerCase().includes('tea')) {
                                  mappedImage = '/images/snacks/teawithfruits.png';
                                } else {
                                  // Fallback to generic popcorn image
                                  mappedImage = '/images/snacks/popcorn.png';
                                }
                                
                                this.src = mappedImage;
                                // Prevent infinite loop
                                this.onerror = null;
                              };
                            }
                          }}
                        />
                      </div>
                      <div className="snack-item-info">
                        <span>{item.snack.name}</span>
                        <span>{item.quantity} × {item.snack.price} {t('common.currency')}</span>
                      </div>
                      <div className="snack-item-total">
                        {item.quantity * item.snack.price} {t('common.currency')}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="snack-total">
                  <span>{t('booking.snackTotal')}:</span>
                  <span>{bookingData.snackTotal} {t('common.currency')}</span>
                </div>
              </div>
            )}
            
            <div className="payment-section">
              <h3 className="text-xl font-bold mb-4">{t('booking.payment')}</h3>
              
              <div className="payment-methods">
                <div className="payment-method selected">
                  <div className="payment-icon">
                    <FaCreditCard className="text-primary" />
                  </div>
                  <div className="font-medium">{t('booking.creditCard')}</div>
                </div>
                
                <div className="payment-method disabled">
                  <div className="payment-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div>PayPal</div>
                </div>
                
                <div className="payment-method disabled">
                  <div className="payment-icon">
                    <FaApple />
                  </div>
                  <div>Apple Pay</div>
                </div>
              </div>
              
              <div className="payment-form">
                <div className="form-group">
                  <label className="form-label">{t('booking.cardNumber')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    inputMode="numeric"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">{t('booking.expiryDate')}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="MM/YY" 
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      inputMode="numeric"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="123" 
                      value={cvv}
                      onChange={handleCvvChange}
                      inputMode="numeric"
                      maxLength={3}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{t('booking.cardholderName')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="John Doe" 
                    value={cardholderName}
                    onChange={handleCardholderNameChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="confirmation-actions">
              <button
                className="action-button cancel-button"
                onClick={handleReturnHome}
              >
                {t('booking.cancel')}
              </button>
              
              <button
                className="action-button pay-button"
                onClick={handlePayment}
                disabled={isPaying || !isFormValid}
              >
                {isPaying ? (
                  <>
                    <LoadingSpinner size="small" color="white" /> 
                    {t('booking.processing')}
                  </>
                ) : (
                  `${t('booking.pay')} ${bookingData.totalPrice} ${t('common.currency')}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;