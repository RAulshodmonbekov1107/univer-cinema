import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../common/LoadingSpinner';
import { movieService, Movie } from '../../api/movieService';
import { showtimeService, Showtime } from '../../api/showtimeService';
import './Booking.css';

// Set a consistent seat price
const SEAT_PRICE = 180; // price in KGS (soms)

// Define seat types
type SeatType = 'standard' | 'premium' | 'vip';

// Seat interface
interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  isAvailable: boolean;
}

// BookingData is used when storing data for the confirmation page
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
  showtimeId: string; // Added showtimeId for backend integration
}

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showtime, setShowtime] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [date, setDate] = useState('');
  const [hall, setHall] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get appropriate title and synopsis based on language
  const getMovieTitle = (movie: Movie) => {
    if (currentLanguage === 'kg') return movie.title_kg;
    if (currentLanguage === 'ru') return movie.title_ru;
    // Default to Kyrgyz if english title is not available 
    return movie.title_kg;
  };
  
  const getMovieSynopsis = (movie: Movie) => {
    if (currentLanguage === 'kg') return movie.synopsis_kg;
    if (currentLanguage === 'ru') return movie.synopsis_ru;
    // Default to Kyrgyz if english synopsis is not available
    return movie.synopsis_kg;
  };

  // Fetch movie details and available seats
  useEffect(() => {
    setLoading(true);
    
    // Check if movie is available
    if (!id) {
      setError(t('booking.movieNotFound'));
      setLoading(false);
      return;
    }
    
    // Fetch movie details and showtimes
    const fetchMovieAndShowtimes = async () => {
      try {
        // Get movie details
        const movieDetails = await movieService.getMovie(id);
        if (!movieDetails) {
          setError(t('booking.movieNotFound'));
          setLoading(false);
          return;
        }
        
        setMovie(movieDetails);
        
        // Fetch showtimes for this movie
        try {
          const showtimeData = await showtimeService.getShowtimesByMovie(id);
          console.log('Fetched showtimes:', showtimeData); // Log the showtime data
          
          if (showtimeData && showtimeData.length > 0) {
            setSelectedShowtime(showtimeData[0]);
            
            // Extract time from the datetime
            const datetime = new Date(showtimeData[0].datetime);
            setShowtime(datetime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDate(datetime.toLocaleDateString());
            setHall(showtimeData[0].hall_name);
            
            // Get seat availability for the selected showtime
            await fetchSeatsForShowtime(showtimeData[0].id);
          } else {
            // If no showtimes available, create mock data
            console.log('No showtimes available, using mock data');
            createMockSeats();
            setShowtime('19:30');
            setDate('2023-11-30');
            setHall('Hall 1');
            setFormat('2D');
            
            // Create a mock showtime with a valid UUID
            const mockShowtime: Showtime = {
              id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Valid UUID format
              movie: movieDetails.id,
              movie_title_kg: movieDetails.title_kg,
              movie_title_ru: movieDetails.title_ru,
              hall: "mock-hall-id",
              hall_name: "Hall 1",
              datetime: "2023-11-30T19:30:00Z",
              language: "kg",
              price: SEAT_PRICE
            };
            
            setSelectedShowtime(mockShowtime);
            console.log('Created mock showtime:', mockShowtime);
          }
        } catch (err) {
          console.error('Error fetching showtimes:', err);
          // Fallback to mock data
          createMockSeats();
          setShowtime('19:30');
          setDate('2023-11-30');
          setHall('Hall 1');
          setFormat('2D');
          
          // Create a mock showtime with a valid UUID
          const mockShowtime: Showtime = {
            id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Valid UUID format
            movie: movieDetails.id,
            movie_title_kg: movieDetails.title_kg,
            movie_title_ru: movieDetails.title_ru,
            hall: "mock-hall-id",
            hall_name: "Hall 1",
            datetime: "2023-11-30T19:30:00Z",
            language: "kg",
            price: SEAT_PRICE
          };
          
          setSelectedShowtime(mockShowtime);
          console.log('Created mock showtime after error:', mockShowtime);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(t('booking.movieNotFound'));
        setLoading(false);
      }
    };
    
    // Fetch available seats for a showtime
    const fetchSeatsForShowtime = async (showtimeId: string) => {
      try {
        const availabilityData = await showtimeService.getAvailableSeats(showtimeId);
        
        if (availabilityData) {
          const { hall_layout, booked_seats } = availabilityData;
          
          // Transform hall layout into seat array
          const generatedSeats: Seat[] = [];
          
          if (hall_layout && Array.isArray(hall_layout.rows)) {
            hall_layout.rows.forEach((row: any) => {
              if (row && row.number && row.seats) {
                row.seats.forEach((seatNum: number) => {
                  const seatId = `${row.letter}${seatNum}`;
                  const isBooked = booked_seats.some((bookedSeat: any) => 
                    bookedSeat.row === row.letter && bookedSeat.number === seatNum
                  );
                  
                  generatedSeats.push({
                    id: seatId,
                    row: row.letter,
                    number: seatNum,
                    type: row.type || 'standard',
                    isAvailable: !isBooked
                  });
                });
              }
            });
            
            setSeats(generatedSeats);
          } else {
            // Fallback to mock data if hall layout is invalid
            createMockSeats();
          }
        } else {
          createMockSeats();
        }
      } catch (err) {
        console.error('Error fetching seats:', err);
        createMockSeats();
      }
    };
    
    // Generate mock seats if real data is unavailable
    const createMockSeats = () => {
      const generatedSeats: Seat[] = [];
      
      // Creating mock seat data
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      rows.forEach(row => {
        for (let i = 1; i <= 12; i++) {
          let type: SeatType = 'standard';
          if (row === 'A' || row === 'B') {
            type = 'premium';
          } else if (row === 'G' || row === 'H') {
            type = 'vip';
          }
          
          // Randomize availability (for demo purposes)
          const isAvailable = Math.random() > 0.3;
          
          generatedSeats.push({
            id: `${row}${i}`,
            row,
            number: i,
            type,
            isAvailable
          });
        }
      });
      
      setSeats(generatedSeats);
    };
    
    fetchMovieAndShowtimes();
  }, [id, t]);
  
  const handleSeatClick = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };
  
  const getSeatStatus = (seat: Seat) => {
    if (!seat.isAvailable) return 'unavailable';
    if (selectedSeats.some(s => s.id === seat.id)) return 'selected';
    return seat.type;
  };
  
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert(t('booking.selectSeatsFirst'));
      return;
    }

    if (!movie) {
      alert(t('booking.movieNotFound'));
      return;
    }

    // Default UUID to use if no showtime ID is available
    const fallbackUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    
    // Prepare booking data for confirmation page
    const bookingData: BookingData = {
      movieId: movie.id,
      movieTitle: getMovieTitle(movie),
      poster: movie.poster,
      selectedSeats,
      totalPrice: selectedSeats.length * SEAT_PRICE,
      date: date,
      time: showtime,
      hall: hall,
      format: format,
      showtimeId: selectedShowtime?.id || fallbackUUID // Use actual showtime ID or fallback UUID
    };
    
    // Log the booking data to help with debugging
    console.log('Booking data prepared:', JSON.stringify(bookingData));
    console.log('Selected showtime:', selectedShowtime);
    
    // Store booking data in localStorage for the confirmation page
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Navigate to booking confirmation
    navigate('/booking-confirmation');
  };
  
  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="container mx-auto px-4 py-8">{t('booking.movieNotFound')}</div>;
  
  return (
    <div className="booking-container">
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="booking-content">
          <div className="booking-movie-details">
            <h2>{movie && getMovieTitle(movie)}</h2>
            <div className="seat-selection-container">
              <div className="screen">{t('booking.screen')}</div>
              <div className="seats-container">
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`seat ${getSeatStatus(seat)}`}
                    aria-label={`${t('booking.seat')} ${seat.row}${seat.number}, ${t(`booking.${seat.type}`)}, ${
                      seat.isAvailable ? t('booking.available') : t('booking.unavailable')
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={!seat.isAvailable}
                  >
                    {seat.row}{seat.number}
                  </button>
                ))}
              </div>
              <div className="seat-legend">
                <div className="legend-item">
                  <div className="seat-sample standard"></div>
                  <span>{t('booking.standard')}</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample premium"></div>
                  <span>{t('booking.premium')}</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample vip"></div>
                  <span>{t('booking.vip')}</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample selected"></div>
                  <span>{t('booking.selected')}</span>
                </div>
                <div className="legend-item">
                  <div className="seat-sample unavailable"></div>
                  <span>{t('booking.unavailable')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="booking-sidebar">
            <div className="booking-summary">
              <h3>{t('booking.summary')}</h3>
              {movie && (
                <>
                  <div className="movie-summary">
                    <h4>{getMovieTitle(movie)}</h4>
                    <p>{getMovieSynopsis(movie).substring(0, 100)}...</p>
                    <p>{t('movies.genre')}: {movie.genre}</p>
                    <p>{t('movies.duration')}: {movie.duration} {t('movies.minutes')}</p>
                  </div>
                  <div className="selected-seats-summary">
                    <h4>{t('booking.selectedSeats')}</h4>
                    {selectedSeats.length === 0 ? (
                      <p>{t('booking.noSeatsSelected')}</p>
                    ) : (
                      <>
                        <p>
                          {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                        </p>
                        <p>
                          {t('booking.totalPrice')}: {selectedSeats.length * SEAT_PRICE} {t('common.currency')}
                        </p>
                      </>
                    )}
                  </div>
                  <button 
                    className="proceed-button"
                    onClick={handleProceedToCheckout}
                    disabled={selectedSeats.length === 0}
                  >
                    {t('booking.proceedToCheckout')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking; 