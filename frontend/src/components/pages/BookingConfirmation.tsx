import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCreditCard, FaApple, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave, FaDownload } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import { authService } from '../../api/authService';
import './BookingConfirmation.css';

// Define interfaces for type checking
interface Seat {
  id: string;
  row: string;
  number: number;
  type: string;
  status: string;
}

interface BookingData {
  movieId: number;
  movieTitle: string;
  poster: string;
  selectedSeats: Seat[];
  totalPrice: number;
  date: string;
  time: string;
  hall: string;
  format: string;
  showtimeId?: string; // Optional showtimeId to link with the backend
}

// Seat price constant
const SEAT_PRICE = 180;

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
    
    try {
      // Retrieve booking data from localStorage
      const storedBookingData = localStorage.getItem('bookingData');
      
      if (!storedBookingData) {
        setError(t('booking.dataNotFound'));
        setLoading(false);
        return;
      }

      const parsedData = JSON.parse(storedBookingData) as BookingData;
      
      // Ensure total price is calculated correctly (in case it wasn't stored properly)
      parsedData.totalPrice = parsedData.selectedSeats.length * SEAT_PRICE;
      
      setBookingData(parsedData);
      
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
        `Row ${seat.row}, Seat ${seat.number}`
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
        <h2 class="movie-title">${bookingData.movieTitle}</h2>
        
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
        
        <div class="price-row">
          <span class="price-label">Total Price:</span>
          <span class="price-value">${bookingData.totalPrice} soms</span>
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
                  src={bookingData.poster}
                  alt={bookingData.movieTitle}
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = '/images/movies/default-poster.jpg';
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
                {bookingData.selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="seat-tag"
                  >
                    {t('booking.rowSeat', { row: seat.row, seat: seat.number })}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="price-summary">
              <span>{t('booking.totalPrice')}:</span>
              <span>{bookingData.totalPrice} {t('common.currency')}</span>
            </div>
            
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