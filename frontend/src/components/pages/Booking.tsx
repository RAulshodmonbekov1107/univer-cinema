import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import type { Movie } from '../../api/movieService';
import type { Showtime } from '../../api/showtimeService';
import { showtimeService } from '../../api/showtimeService';
import './Booking.css';
import { FaCalendarAlt, FaClock, FaTicketAlt, FaTimes } from 'react-icons/fa';

// Constants
const SEAT_PRICE = {
  standard: 180,
  vip: 320
};

// Seat types
type SeatType = 'standard' | 'vip' | 'unavailable';

interface SeatState {
  row: number;
  seatNumber: number;
  selected: boolean;
  type: SeatType;
  price: number;
}

interface DebugInfo {
  selectedShowtime: string;
  selectedSeats: string[];
  totalPrice: number;
  timestamp: string;
}

// Export the SeatState type for other components to use
export type Seat = SeatState;

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<SeatState[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatState[]>([]);
  const [showtime, setShowtime] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [date, setDate] = useState('');
  const [hall, setHall] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  // Get appropriate title based on language
  const getMovieTitle = (movie: Movie) => {
    if (currentLanguage === 'kg') return movie.title_kg;
    if (currentLanguage === 'ru') return movie.title_ru;
    // Default to Kyrgyz if english title is not available 
    return movie.title_kg;
  };

  // Create mock seats for development/fallback
  const createMockSeats = useCallback((hallName: string = 'Main Hall') => {
    const mockSeats: SeatState[][] = [];
    
    // Keep 3 rows with 11 seats, but we'll add spacing for better distribution
    const rowCount = 3; // 3 rows (A, B, C)
    const seatsPerRow = 11; // 11 seats per row, for a total of 33 seats
    
    // Generate some unavailable seats randomly
    const unavailableSeats = new Set<string>();
    const unavailableCount = Math.floor(rowCount * seatsPerRow * 0.2); // Only make 20% unavailable
    
    for (let i = 0; i < unavailableCount; i++) {
      const randomRow = Math.floor(Math.random() * rowCount) + 1;
      const randomSeat = Math.floor(Math.random() * seatsPerRow) + 1;
      unavailableSeats.add(`${randomRow}-${randomSeat}`);
    }
    
    // Create the rows and seats
    for (let row = 1; row <= rowCount; row++) {
      const currentRow: SeatState[] = [];
      
      // For better distribution, we'll place seats with indices from 1 to 11
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatId = `${row}-${seatNum}`;
        const isUnavailable = unavailableSeats.has(seatId);
        
        // Determine seat type - only standard or VIP seats
        // VIP seats are in row C (last row)
        let type: SeatType = 'standard';
        if (row === rowCount) {
          type = 'vip';
        }
        
        // If seat is unavailable, mark it as such
        if (isUnavailable) {
          type = 'unavailable';
        }
        
        currentRow.push({
          row,
          seatNumber: seatNum,
          selected: false,
          type,
          price: type === 'unavailable' ? 0 : SEAT_PRICE[type]
        });
      }
      
      mockSeats.push(currentRow);
    }
    
    return mockSeats;
  }, []);

  // Fetch movie details and available seats
  useEffect(() => {
    setLoading(true);
    setDebugInfo(null);
    
    // Clear any lingering snack data to prevent it from appearing in new bookings
    localStorage.removeItem('cartItems');
    
    // Get showtime ID from URL parameters
    if (!id) {
      console.error('No showtime ID provided');
      setError(t('booking.movieNotFound'));
      setLoading(false);
      return;
    }

    // Try to get showtime data from localStorage
    const savedShowtime = localStorage.getItem('selectedShowtime');
    const savedParams = localStorage.getItem('currentShowtimeParams');
    
    // Debug log
    console.log('Booking: loaded selectedShowtime:', savedShowtime);
    console.log('Booking: loaded currentShowtimeParams:', savedParams);
    console.log('Booking: showtime ID from URL:', id);
    setDebugInfo({
      selectedShowtime: id,
      selectedSeats: [],
      totalPrice: 0,
      timestamp: new Date().toISOString()
    });
    
    if (!savedShowtime || !savedParams) {
      console.log('No saved showtime data found, attempting to fetch from API');
      
      // Fetch showtime data from API using the id from URL parameters
      showtimeService.getShowtime(id)
        .then(showtime => {
          console.log('API returned showtime:', showtime);
          // Process the showtime data
          setShowtime(new Date(showtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setDate(new Date(showtime.datetime).toLocaleDateString());
          setHall(showtime.hall_name || 'Main Hall');
          setFormat(showtime.format || '2D');
          
          // Create mock seats
          const seatData = createMockSeats(showtime.hall_name || 'Main Hall');
          setSeats(seatData);
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching showtime from API:', err);
          console.log('Falling back to mock data');
          
          // Fallback: try to find the showtime in mockShowtimes
          const mockShowtimesRaw = localStorage.getItem('mockShowtimes');
          if (mockShowtimesRaw) {
            const mockShowtimes = JSON.parse(mockShowtimesRaw);
            const foundShowtime = mockShowtimes.find((s: any) => s.id === id);
            if (foundShowtime) {
              const mockMovie = {
                id: foundShowtime.movie,
                title_kg: foundShowtime.movie_title_kg,
                title_ru: foundShowtime.movie_title_ru,
                synopsis_kg: 'Кыргызстан тарыхындагы эң маанилүү окуялар жөнүндө тасма.',
                synopsis_ru: 'Фильм о важнейших событиях в истории Кыргызстана.',
                trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                genre: 'drama',
                language: foundShowtime.language,
                duration: 120,
                poster_url: foundShowtime.poster_url || '/assets/images/poster-placeholder.png',
                poster: foundShowtime.poster_url || '/assets/images/poster-placeholder.png',
                release_date: '2023-08-31',
                is_showing: true
              };
              setMovie(mockMovie);
              setSelectedShowtime(foundShowtime);
              setShowtime(new Date(foundShowtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              setDate(new Date(foundShowtime.datetime).toLocaleDateString());
              setHall(foundShowtime.hall_name);
              setFormat(foundShowtime.format);
              const seatData = createMockSeats(foundShowtime.hall_name);
              setSeats(seatData);
              setLoading(false);
              return;
            }
          }
          // Fallback: fetch showtime from API
          (async () => {
            try {
              const showtime = await showtimeService.getShowtime(id);
              const mockMovie = {
                id: showtime.movie,
                title_kg: showtime.movie_title_kg,
                title_ru: showtime.movie_title_ru,
                synopsis_kg: 'Кыргызстан тарыхындагы эң маанилүү окуялар жөнүндө тасма.',
                synopsis_ru: 'Фильм о важнейших событиях в истории Кыргызстана.',
                trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                genre: 'drama',
                language: showtime.language,
                duration: 120,
                poster_url: showtime.poster_url || '/assets/images/poster-placeholder.png',
                poster: showtime.poster_url || '/assets/images/poster-placeholder.png',
                release_date: '2023-08-31',
                is_showing: true
              };
              setMovie(mockMovie);
              setSelectedShowtime(showtime);
              setShowtime(new Date(showtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
              setDate(new Date(showtime.datetime).toLocaleDateString());
              setHall(showtime.hall_name);
              setFormat(showtime.format);
              const seatData = createMockSeats(showtime.hall_name);
              setSeats(seatData);
            } catch (err) {
              setError('No showtime data found in localStorage or API. Try booking from the Schedule page.');
            } finally {
              setLoading(false);
            }
          })();
        });
      return;
    }

    try {
      // Type assertion to handle potential null values
      if (!savedShowtime || !savedParams) {
        throw new Error('Missing saved data');
      }
      
      const parsedShowtime = JSON.parse(savedShowtime) as Showtime;
      const parsedParams = JSON.parse(savedParams);
      
      // Check for required fields
      if (!parsedShowtime.id || !parsedShowtime.movie_title_kg || !parsedShowtime.hall_name || !parsedShowtime.datetime) {
        setError('Showtime data is incomplete. Try booking from the Schedule page.');
        setLoading(false);
        return;
      }
      if (parsedShowtime.id !== id) {
        setError('Showtime ID mismatch. Try booking from the Schedule page.');
        setLoading(false);
        return;
      }

      // Create mock movie data from the saved showtime
      const mockMovie: Movie = {
        id: parsedShowtime.movie,
        title_kg: parsedShowtime.movie_title_kg,
        title_ru: parsedShowtime.movie_title_ru,
        synopsis_kg: 'Кыргызстан тарыхындагы эң маанилүү окуялар жөнүндө тасма.',
        synopsis_ru: 'Фильм о важнейших событиях в истории Кыргызстана.',
        trailer: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        genre: 'drama',
        language: parsedShowtime.language,
        duration: 120,
        poster_url: parsedParams.poster || '/assets/images/poster-placeholder.png',
        poster: parsedParams.poster || '/assets/images/poster-placeholder.png',
        release_date: '2023-08-31',
        is_showing: true
      };

      setMovie(mockMovie);
      setSelectedShowtime(parsedShowtime);
      setShowtime(new Date(parsedShowtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(parsedParams.date);
      setHall(parsedShowtime.hall_name);
      setFormat(parsedShowtime.format);
      const seatData = createMockSeats(parsedShowtime.hall_name);
      setSeats(seatData);
      
    } catch (err) {
      console.error('Error parsing saved data:', err);
      setError('Error parsing showtime data. Try booking from the Schedule page.');
    } finally {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      if (window.location.pathname !== '/booking-confirmation') {
        localStorage.removeItem('selectedShowtime');
        localStorage.removeItem('currentShowtimeParams');
      }
    };
  }, [id, t, createMockSeats]);

  // Handle seat selection
  const handleSeatClick = (row: number, seatNumber: number) => {
    const newSeats = [...seats];
    const rowIndex = row - 1;
    const seatIndex = seatNumber - 1;
    
    // Check if seat is unavailable
    if (newSeats[rowIndex][seatIndex].type === 'unavailable') {
      return;
    }
    
    // Toggle selection
    newSeats[rowIndex][seatIndex].selected = !newSeats[rowIndex][seatIndex].selected;
    
    // Update selected seats list
    if (newSeats[rowIndex][seatIndex].selected) {
      setSelectedSeats([...selectedSeats, newSeats[rowIndex][seatIndex]]);
    } else {
      setSelectedSeats(selectedSeats.filter(seat => 
        !(seat.row === row && seat.seatNumber === seatNumber)
      ));
    }
    
    setSeats(newSeats);
  };
  
  // Proceed to snacks after seat selection
  const handleProceedToSnacks = () => {
    if (selectedSeats.length === 0) {
      alert(t('booking.selectSeatsFirst'));
      return;
    }
    
    if (!movie || !selectedShowtime) {
      setError(t('booking.dataNotFound'));
      return;
    }

    // Ensure we have valid data for all required fields
    const safePoster = movie.poster_url && movie.poster_url.trim() !== '' ? movie.poster_url : '/images/movies/default-poster.jpg';
    const safeMovieTitle = getMovieTitle(movie) || movie.title_kg || movie.title_ru || 'Unknown Title';
    const safeDate = date || (selectedShowtime.datetime ? new Date(selectedShowtime.datetime).toLocaleDateString() : new Date().toLocaleDateString());
    const safeTime = showtime || (selectedShowtime.datetime ? new Date(selectedShowtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const safeHall = hall || selectedShowtime.hall_name || 'Main Hall';
    const safeFormat = format || selectedShowtime.format || '2D';
    const serviceFee = 0; // No service fee
    const seatTotal = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const totalPrice = seatTotal + serviceFee; // Total is just the seat prices

    // Validate that we have valid seats
    if (!selectedSeats || selectedSeats.length === 0) {
      alert(t('booking.selectSeatsFirst'));
      return;
    }

    // Ensure each seat has the required properties
    const validatedSeats = selectedSeats.map(seat => ({
      row: seat.row,
      seatNumber: seat.seatNumber,
      type: seat.type,
      price: seat.price // Keep original seat price
    }));

    // Prepare booking data for confirmation page
    const bookingData = {
      showTimeId: selectedShowtime.id,
      movie: movie,
      showTime: selectedShowtime,
      selectedSeats: validatedSeats,
      totalPrice: totalPrice
    };
    
    // Log booking data for debugging
    console.log("Creating booking with data:", bookingData);
    
    // Save booking data to localStorage for the confirmation page
    try {
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // Also make sure we have the current showtime params saved
      const showtimeParams = {
        id: selectedShowtime.id,
        movie: movie.id,
        title: safeMovieTitle,
        time: safeTime,
        date: safeDate,
        hall: safeHall,
        format: safeFormat,
        poster: safePoster,
        language: movie.language || selectedShowtime.language || 'KG',
        price: totalPrice
      };
      
      localStorage.setItem('currentShowtimeParams', JSON.stringify(showtimeParams));
      
      // Navigate to snack selection page instead of confirmation
      navigate('/snack-selection');
    } catch (error) {
      console.error('Error saving booking data:', error);
      alert(t('booking.errorSavingData'));
    }
  };

  // Debug button
  const handleDebug = () => {
    // Toggle debug mode
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);
    
    // Only set debug info when enabling debug mode
    if (newDebugMode) {
      setDebugInfo({
        selectedShowtime: selectedShowtime?.id || 'No showtime ID',
        selectedSeats: selectedSeats.map(seat => `${String.fromCharCode(64 + seat.row)}${seat.seatNumber}`),
        totalPrice: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        timestamp: new Date().toISOString()
      });
    }
    
    // Toggle debug class on the body
    document.body.classList.toggle('debug-active', newDebugMode);
  };

  if (loading) {
    return (
      <div className="booking-container">
        <LoadingSpinner fullScreen />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="booking-container">
        <div className="booking-error">
          <h2>{error || t('booking.movieNotFound')}</h2>
          <button 
            className="btn-primary"
            onClick={() => navigate('/movies')}
          >
            {t('common.backToHome')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`booking-container ${debugMode ? 'debug-active' : ''}`}>
      <h1 className="booking-title">{t('booking.selectSeats')}</h1>
      
      {loading ? (
        <div className="booking-loading">
          <LoadingSpinner />
          <p>{t('common.loading')}</p>
        </div>
      ) : error ? (
        <div className="booking-error">{error}</div>
      ) : (
        <>
          {/* Movie Info Section */}
          <div className="movie-info">
            {movie?.poster_url ? (
              <img 
                src={movie.poster_url} 
                alt={getMovieTitle(movie)} 
                className="movie-poster" 
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/assets/images/poster-placeholder.png';
                }}
              />
            ) : (
              <div className="movie-poster-placeholder"></div>
            )}
            
            <div className="movie-details">
              <div>
                <h2 className="movie-title">{movie ? getMovieTitle(movie) : t('booking.unavailable')}</h2>
                <div className="movie-meta">
                  {movie?.duration ? (
                    <span>{movie.duration} {t('common.minutes')}</span>
                  ) : null}
                </div>
              </div>
              
              <div className="showtime-detail">
                <p><FaCalendarAlt /> {date || t('booking.unavailable')}</p>
                <p><FaClock /> {showtime || t('booking.unavailable')}</p>  
                <p><FaTicketAlt /> {hall || t('booking.unavailable')} • {format || '2D'}</p>
              </div>
            </div>
          </div>
          
          {/* Enhanced Seat Selection Area */}
          <div className="seats-container">
            <div className="screen"></div>
            
            <div className="seat-map">
              {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  <div className="row-label">
                    {String.fromCharCode(65 + rowIndex)}
                  </div>
                  <div className="row-seats">
                    {row.map((seat) => (
                      <div
                        key={`${seat.row}-${seat.seatNumber}`}
                        className={`seat ${seat.type === 'unavailable' ? 'seat-unavailable' : ''} 
                                  ${seat.type === 'vip' ? 'seat-vip' : ''} 
                                  ${seat.selected ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat.row, seat.seatNumber)}
                      >
                        <span className="seat-number">{seat.seatNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Seat Legend */}
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat-sample seat-standard"></div>
                <span>{t('booking.standard')} ({SEAT_PRICE.standard} {t('common.currency')})</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample seat-vip"></div>
                <span>{t('booking.vip')} ({SEAT_PRICE.vip} {t('common.currency')})</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample seat-selected"></div>
                <span>{t('booking.selected')}</span>
              </div>
              <div className="legend-item">
                <div className="seat-sample seat-unavailable"></div>
                <span>{t('booking.unavailable')}</span>
              </div>
            </div>
          </div>
          
          {/* Booking Summary Section */}
          <div className="booking-summary">
            <div className="selected-seats">
              <h3>{currentLanguage === 'ru' ? 'Выбранные места:' : currentLanguage === 'kg' ? 'Тандалган орундар:' : 'Selected Seats:'}</h3>
              {selectedSeats.length === 0 ? (
                <p className="no-seats">{currentLanguage === 'ru' ? 'Места не выбраны' : currentLanguage === 'kg' ? 'Орундар тандалган жок' : 'No seats selected'}</p>
              ) : (
                <div className="selected-seats-list">
                  {selectedSeats.map((seat, index) => (
                    <div key={index} className="selected-seat">
                      <span className="seat-label">
                        {String.fromCharCode(64 + seat.row)}{seat.seatNumber} 
                        ({seat.type === 'standard' ? t('booking.standard') : t('booking.vip')})
                      </span>
                      <button 
                        className="remove-seat" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeatClick(seat.row, seat.seatNumber);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="booking-totals">
              <div className="booking-total-item">
                <span>{currentLanguage === 'ru' ? 'Билеты' : currentLanguage === 'kg' ? 'Билеттер' : 'Tickets'}</span>
                <span>{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(0)} {t('common.currency')}</span>
              </div>
              <div className="booking-total-item">
                <span>{currentLanguage === 'ru' ? 'Сервисный сбор' : currentLanguage === 'kg' ? 'Тейлөө акысы' : 'Service Fee'}</span>
                <span>0 {t('common.currency')}</span>
              </div>
              <div className="booking-total">
                <span>{currentLanguage === 'ru' ? 'Итого' : currentLanguage === 'kg' ? 'Жалпы' : 'Total'}</span>
                <span>{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(0)} {t('common.currency')}</span>
              </div>
            </div>
            
            <button 
              className="checkout-button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToSnacks}
            >
              {currentLanguage === 'ru' ? 'ПЕРЕЙТИ К ОПЛАТЕ' : 
               currentLanguage === 'kg' ? 'ТӨЛӨМГӨ ӨТҮҮ' : 'CONTINUE TO CHECKOUT'}
            </button>
          </div>
          
          {/* Debug section for development */}
          <div className="debug-section">
            <h3>Debug Information</h3>
            <div className="debug-info">
              {debugInfo && JSON.stringify(debugInfo, null, 2)}
            </div>
          </div>
          
          <button className="debug-button" onClick={handleDebug}>
            {debugMode ? 'Hide Debug' : 'Debug'}
          </button>
        </>
      )}
    </div>
  );
};

export default Booking; 