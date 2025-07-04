import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaStar, FaPlayCircle, FaTicketAlt, FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';
import { movieService, Movie } from '../../api/movieService';
import { showtimeService, Showtime } from '../../api/showtimeService';
import { getMovieTitle, getMovieSynopsis, getMovieMetadata } from '../../utils/movieHelpers';
import { useBooking } from '../../contexts/BookingContext';
import './MovieDetails.css';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLanguage = i18n.language;
  const { startNewBooking } = useBooking();
  
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'showtimes' | 'reviews'>('about');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Animation classes
  const fadeIn = "animate-fade-in";
  const slideUp = "animate-slide-up";
  
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const movieData = await movieService.getMovie(id);
        setMovie(movieData);
        
        // Set today as default selected date
        const today = new Date();
        setSelectedDate(today.toISOString().split('T')[0]);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [id]);
  
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!id || !selectedDate) return;
      
      try {
        setLoadingShowtimes(true);
        const showtimesData = await showtimeService.getShowtimesByMovie(id);
        // Filter showtimes for the selected date
        const filteredShowtimes = showtimesData.filter((showtime: Showtime) => 
          showtime.datetime.startsWith(selectedDate)
        );
        setShowtimes(filteredShowtimes);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      } finally {
        setLoadingShowtimes(false);
      }
    };
    
    if (activeTab === 'showtimes') {
      fetchShowtimes();
    }
  }, [id, selectedDate, activeTab]);
  
  // Generate next 7 days for showtimes
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString(currentLanguage === 'kg' ? 'ky-KG' : 'ru-RU', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    
    return dates;
  };
  
  const handleBookTicket = async (showtimeId: string) => {
    // Clear any previous booking data when starting a new booking
    startNewBooking();
    
    setBookingLoading(true);
    try {
      // Fetch showtime data
      const showtime = await showtimeService.getShowtime(showtimeId);
      // Store showtime data in localStorage (same as Schedule page)
      localStorage.setItem('selectedShowtime', JSON.stringify({
        ...showtime,
        poster: movie?.poster || '',
        availableSeats: 100, // fallback/mock
        totalSeats: 120 // fallback/mock
      }));
      localStorage.setItem('currentShowtimeParams', JSON.stringify({
        id: showtime.id,
        movie: showtime.movie,
        title: showtime.movie_title_kg,
        time: new Date(showtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(showtime.datetime).toLocaleDateString(),
        hall: showtime.hall_name,
        format: showtime.format,
        poster: movie?.poster || '',
        language: showtime.language,
        price: showtime.price
      }));
      // Debug log
      console.log('MovieDetails: set selectedShowtime:', localStorage.getItem('selectedShowtime'));
      console.log('MovieDetails: set currentShowtimeParams:', localStorage.getItem('currentShowtimeParams'));
      setBookingLoading(false);
      navigate(`/booking/${showtimeId}`);
    } catch (err) {
      setBookingLoading(false);
      alert('Failed to load showtime data for booking.');
    }
  };
  
  // Mock reviews data
  const reviews = [
    { id: 1, author: 'Александр П.', rating: 4.5, text: 'Отличный фильм, всем рекомендую!', date: '2023-05-15' },
    { id: 2, author: 'Елена К.', rating: 5, text: 'Один из лучших фильмов, которые я видела в этом году.', date: '2023-05-10' },
    { id: 3, author: 'Михаил С.', rating: 3.5, text: 'Неплохой фильм, но ожидал большего.', date: '2023-05-05' },
  ];
  
  // Group showtimes by language and hall type
  const groupedShowtimes = () => {
    if (!showtimes.length) return { standard: [], vip: [] };
    
    return {
      standard: showtimes.filter(showtime => showtime.hall_name.toLowerCase().includes('standard')),
      vip: showtimes.filter(showtime => showtime.hall_name.toLowerCase().includes('vip'))
    };
  };
  
  // Format datetime to time only (e.g., "14:30")
  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  if (!movie) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-white p-8 rounded-xl shadow-md inline-block">
          <FaInfoCircle className="text-4xl text-gray-400 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold mb-2">{t('movies.notFound')}</h2>
          <p className="text-gray-600 mb-6">{t('movies.notFoundDesc')}</p>
          <Link to="/movies" className="btn-primary">
            {t('movies.browseMovies')}
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-dark text-white">
      {/* Hero Section with Backdrop */}
      <div className="movie-backdrop" style={{ backgroundImage: `url(${movie.poster})` }}>
        {/* Content */}
        <div className="container-custom relative z-10 h-full flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Movie Poster */}
            <div className={`shrink-0 w-48 md:w-64 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 ${fadeIn}`}>
              <img 
                src={movie.poster} 
                alt={getMovieTitle(movie, currentLanguage)} 
                className="w-full h-auto"
              />
            </div>
            
            {/* Movie Info */}
            <div className={`flex-1 movie-info-block ${slideUp}`}>
              <div className="flex items-center mb-3">
                <span className="movie-badge badge-age">12+</span>
                <div className="badge-rating flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">8.5</span>
                  <span className="text-gray-400 text-sm ml-1">IMDb</span>
                </div>
              </div>
              
              <h1 className="movie-banner-title">
                {getMovieTitle(movie, currentLanguage)}
              </h1>
              
              <div className="movie-subtitle">
                {getMovieMetadata(movie, t('movies.minutes')).split(' • ').map((item, index, array) => (
                  <React.Fragment key={index}>
                    <span>{item}</span>
                    {index < array.length - 1 && <span className="movie-subtitle-dot" />}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-4 mt-8">
                <button 
                  onClick={() => setTrailerOpen(true)}
                  className="btn-outline border-white text-white hover:bg-white hover:text-dark flex items-center"
                >
                  <FaPlayCircle className="mr-2" />
                  {t('movies.watchTrailer')}
                </button>
                
                <button 
                  onClick={() => setActiveTab('showtimes')}
                  className="btn-primary flex items-center"
                >
                  <FaTicketAlt className="mr-2" />
                  {t('movies.bookTickets')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-dark z-20 border-b border-gray-800">
        <div className="container-custom">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('about')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'about' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
            >
              {t('movies.about')}
            </button>
            <button 
              onClick={() => setActiveTab('showtimes')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'showtimes' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
            >
              {t('movies.showtimes')}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
            >
              {t('movies.reviews')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container-custom py-10">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 ${fadeIn}`}>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">{t('movies.synopsis')}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                {getMovieSynopsis(movie, currentLanguage)}
              </p>
              
              {/* Movie Details */}
              <div className="mt-10 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">{t('movies.cast')}</h3>
                  <p className="text-gray-300">
                    John Doe, Jane Smith, Robert Johnson, Emma Williams
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">{t('movies.director')}</h3>
                  <p className="text-gray-300">
                    Christopher Nolan
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('movies.details')}</h2>
              
              <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <FaClock className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">{t('movies.duration')}</h4>
                    <p>{movie.duration} {t('movies.minutes')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <FaCalendarAlt className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">{t('movies.releaseDate')}</h4>
                    <p>{movie.release_date}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <div className="text-primary font-bold text-sm">PG</div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">{t('movies.ageRating')}</h4>
                    <p>12+</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <FaStar className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-400">{t('movies.imdbRating')}</h4>
                    <p>8.5/10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Showtimes Tab */}
        {activeTab === 'showtimes' && (
          <div className={`${fadeIn}`}>
            <h2 className="text-2xl font-bold mb-8">{t('movies.selectShowtime')}</h2>
            
            {/* Date Selection */}
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-4 text-gray-300">{t('movies.selectDate')}</h3>
              <div className="flex overflow-x-auto pb-2 gap-2">
                {getDates().map((date) => (
                  <button
                    key={date.date}
                    onClick={() => setSelectedDate(date.date)}
                    className={`flex flex-col items-center min-w-[80px] p-4 rounded-lg transition-colors ${
                      selectedDate === date.date 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{date.dayName}</span>
                    <span className="text-2xl font-bold mt-1">{date.dayNumber}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Showtimes */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-300">{t('movies.availableShowtimes')}</h3>
              
              {loadingShowtimes ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : showtimes.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl p-6 text-center py-12">
                  <p className="text-gray-400">{t('movies.noShowtimesAvailable')}</p>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-6">
                  {/* Standard Showtimes */}
                  {groupedShowtimes().standard.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-bold text-xl mb-4">{t('movies.standard')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {groupedShowtimes().standard.map((showtime) => (
                          <button
                            key={showtime.id}
                            onClick={() => handleBookTicket(showtime.id)}
                            className="p-3 rounded-lg text-center transition-transform transform hover:scale-105 bg-gray-700 hover:bg-gray-600 text-white"
                            disabled={bookingLoading}
                          >
                            <span className="font-medium">{formatTime(showtime.datetime)}</span>
                            <div className="text-xs mt-1">{showtime.language === 'kg' ? t('movies.kyrgyz') : showtime.language === 'ru' ? t('movies.russian') : t('movies.original')}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* VIP Showtimes */}
                  {groupedShowtimes().vip.length > 0 && (
                    <div>
                      <h4 className="font-bold text-xl mb-4">{t('movies.vip')}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {groupedShowtimes().vip.map((showtime) => (
                          <button
                            key={showtime.id}
                            onClick={() => handleBookTicket(showtime.id)}
                            className="p-3 rounded-lg text-center transition-transform transform hover:scale-105 bg-primary/80 hover:bg-primary text-white"
                            disabled={bookingLoading}
                          >
                            <span className="font-medium">{formatTime(showtime.datetime)}</span>
                            <div className="text-xs mt-1">{showtime.language === 'kg' ? t('movies.kyrgyz') : showtime.language === 'ru' ? t('movies.russian') : t('movies.original')}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Seat Legend */}
              {showtimes.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-700 rounded-sm mr-2"></div>
                    <span>{t('movies.standard')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary/80 rounded-sm mr-2"></div>
                    <span>{t('movies.vip')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className={`${fadeIn}`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t('movies.userReviews')}</h2>
              <button className="btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                {t('movies.writeReview')}
              </button>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-800/50 rounded-xl p-6 transform transition-transform hover:scale-[1.01]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{review.author}</h3>
                      <p className="text-gray-400 text-sm">{review.date}</p>
                    </div>
                    <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Trailer Modal */}
      {trailerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden">
            <button 
              onClick={() => setTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
            >
              ✕
            </button>
            <div className="aspect-video bg-gray-800">
              <iframe 
                width="100%" 
                height="100%" 
                src={movie.trailer || `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`}
                title={`${getMovieTitle(movie, currentLanguage)} trailer`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails; 