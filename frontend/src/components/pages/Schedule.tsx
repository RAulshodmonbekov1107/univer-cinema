import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaFilter, FaChevronLeft, FaChevronRight, FaFilm, FaThLarge, FaList, FaTags, FaRegClock, FaMapMarkerAlt, FaTheaterMasks, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import PageBanner from '../common/PageBanner';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { movieService, Movie } from '../../api/movieService';
import { showtimeService } from '../../api/showtimeService';
import { sampleMovies } from '../../data/sampleMovies';
import { useBooking } from '../../contexts/BookingContext';
import './Schedule.css';

// Custom date utilities to avoid date-fns dependency
const formatDate = (date: Date, format: string, language: string = 'en'): string => {
  const days = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    kg: ['Жш', 'Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш'],
  };
  
  const months = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    kg: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  };
  
  const lang = language in days ? language : 'en';
  
  if (format === 'EEE') {
    return days[lang as keyof typeof days][date.getDay()];
  } else if (format === 'd') {
    return date.getDate().toString();
  } else if (format === 'MMM') {
    return months[lang as keyof typeof months][date.getMonth()];
  } else if (format === 'EEEE, MMMM d') {
    const day = date.getDate();
    const month = months[lang as keyof typeof months][date.getMonth()];
    const weekday = [
      lang === 'en' ? 'Sunday' : lang === 'ru' ? 'Воскресенье' : 'Жекшемби',
      lang === 'en' ? 'Monday' : lang === 'ru' ? 'Понедельник' : 'Дүйшөмбү',
      lang === 'en' ? 'Tuesday' : lang === 'ru' ? 'Вторник' : 'Шейшемби',
      lang === 'en' ? 'Wednesday' : lang === 'ru' ? 'Среда' : 'Шаршемби',
      lang === 'en' ? 'Thursday' : lang === 'ru' ? 'Четверг' : 'Бейшемби',
      lang === 'en' ? 'Friday' : lang === 'ru' ? 'Пятница' : 'Жума',
      lang === 'en' ? 'Saturday' : lang === 'ru' ? 'Суббота' : 'Ишемби',
    ][date.getDay()];
    
    return `${weekday}, ${month} ${day}`;
  }
  
  return date.toLocaleDateString();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Types and Interfaces
interface MovieShowtime {
  id: string;
  movie: string;
  movie_title_kg: string;
  movie_title_ru: string;
  hall: string;
  hall_name: string;
  datetime: string;
  language: string;
  price: number;
  format: string;
  poster: string;
  availableSeats?: number;
  totalSeats?: number;
}

interface DisplayMovie {
  id: string;
  title: string;
  poster: string;
}

// Helper functions
const getSeatStatus = (available: number = 0, total: number = 1) => {
  const percentage = (available / total) * 100;
  if (percentage > 60) return 'high';
  if (percentage > 30) return 'medium';
  return 'low';
};

// Generate mock showtimes for sample movies based on selected date
const generateMockShowtimesFromSampleMovies = (selectedDate: Date, sampleMovies: any[]): MovieShowtime[] => {
  // Use only showing movies
  const showingMovies = sampleMovies.filter(movie => movie.is_showing);
  
  const baseDate = new Date(selectedDate);
  baseDate.setHours(0, 0, 0, 0);
  
  const mockShowtimes: MovieShowtime[] = [];
  
  // Common hall names and formats
  const halls = ['Main Hall', 'VIP Hall', 'IMAX Hall', 'Premium Hall'];
  const formats = ['2D', '3D', 'IMAX', 'Dolby Atmos'];
  
  // For each movie, create 2-4 showtimes at different times
  showingMovies.forEach(movie => {
    const numShowtimes = 2 + Math.floor(Math.random() * 3); // 2-4 showtimes
    
    for (let i = 0; i < numShowtimes; i++) {
      // Create a showtime at different hours
      const hours = 12 + i * 3; // Starting from noon, with 3-hour intervals
      const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, or 45 minutes
      
      const showtime = new Date(baseDate);
      showtime.setHours(hours, minutes);
      
      // Randomly select hall and format
      const hallIndex = Math.floor(Math.random() * halls.length);
      const formatIndex = Math.floor(Math.random() * formats.length);
      const price = 150 + (hallIndex * 30) + (formatIndex * 20); // Base price plus modifiers
      
      // Generate random seat availability
      const totalSeats = 100 + (hallIndex * 20);
      const availableSeats = Math.floor(Math.random() * (totalSeats * 0.8)) + Math.ceil(totalSeats * 0.2);
      
      mockShowtimes.push({
        id: `mock-${movie.id}-${i}-${showtime.getTime()}`,
        movie: movie.id,
        movie_title_kg: movie.title_kg,
        movie_title_ru: movie.title_ru,
        hall: `hall-${hallIndex + 1}`,
        hall_name: halls[hallIndex],
        datetime: showtime.toISOString(),
        language: movie.language,
        price: price,
        format: formats[formatIndex],
        poster: movie.poster,
        availableSeats: availableSeats,
        totalSeats: totalSeats
      });
    }
  });
  
  // Sort by datetime
  return mockShowtimes.sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
};

// DateNavigator Component
interface DateNavigatorProps {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  calendarStartIndex: number;
  setCalendarStartIndex: (index: number) => void;
  currentLang: string;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ 
  dates, 
  selectedDate, 
  setSelectedDate, 
  calendarStartIndex, 
  setCalendarStartIndex,
  currentLang
}) => {
  const { t } = useTranslation();
  const visibleDates = dates.slice(calendarStartIndex, calendarStartIndex + 7);
  
  const nextDates = () => {
    if (calendarStartIndex + 7 < dates.length) {
      setCalendarStartIndex(calendarStartIndex + 7);
    }
  };
  
  const prevDates = () => {
    if (calendarStartIndex > 0) {
      setCalendarStartIndex(calendarStartIndex - 7);
    }
  };

  return (
    <div className="date-navigator-container">
      <div className="date-navigator-header">
        <h2 className="date-navigator-title">
          <FaCalendarAlt className="date-icon" /> {t('schedule.selectDate')}
        </h2>
        <div className="date-controls">
          <button
            className="date-control-btn"
            onClick={prevDates}
            disabled={calendarStartIndex === 0}
          >
            <FaChevronLeft />
          </button>
          <span className="current-week-label">
            {formatDate(visibleDates[0], 'MMM', currentLang)} {visibleDates[0].getDate()} - {formatDate(visibleDates[visibleDates.length - 1], 'MMM', currentLang)} {visibleDates[visibleDates.length - 1].getDate()}
          </span>
          <button
            className="date-control-btn"
            onClick={nextDates}
            disabled={calendarStartIndex + 7 >= dates.length}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      
      <div className="date-cards-container">
        {visibleDates.map((date) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selectedDate);
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`date-card ${isSelected ? 'date-card-selected' : ''} ${isToday ? 'date-card-today' : ''}`}
            >
              <div className="date-card-day">
                {formatDate(date, 'EEE', currentLang)}
              </div>
              <div className="date-card-number">
                {date.getDate()}
              </div>
              <div className="date-card-month">
                {formatDate(date, 'MMM', currentLang)}
              </div>
              {isToday && <div className="date-card-today-marker">{t('schedule.today')}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// FiltersSection Component
interface FiltersSectionProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  selectedHall: string;
  setSelectedHall: (hall: string) => void;
  formats: string[];
  halls: string[];
  resetFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  showFilters,
  setShowFilters,
  selectedFormat,
  setSelectedFormat,
  selectedHall,
  setSelectedHall,
  formats,
  halls,
  resetFilters
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="filters-container">
      <div className="filters-header" onClick={() => setShowFilters(!showFilters)}>
        <FaFilter className="filter-icon" /> 
        <h3 className="filters-title">{t('schedule.filters')}</h3>
        <div className={`chevron ${showFilters ? 'chevron-up' : 'chevron-down'}`}>
          {showFilters ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
      
      {showFilters && (
        <div className="filters-content">
          <div className="filter-group">
            <div className="filter-group-title">
              <FaFilm /> {t('schedule.format')}
            </div>
            <div className="filter-options">
              <button 
                className={`filter-option ${selectedFormat === 'all' ? 'filter-option-selected' : ''}`}
                onClick={() => setSelectedFormat('all')}
              >
                {t('schedule.all')}
              </button>
              {formats.map(format => (
                <button
                  key={format}
                  className={`filter-option ${selectedFormat === format ? 'filter-option-selected' : ''}`}
                  onClick={() => setSelectedFormat(format)}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-group">
            <div className="filter-group-title">
              <FaTheaterMasks /> {t('schedule.hall')}
            </div>
            <div className="filter-options">
              <button 
                className={`filter-option ${selectedHall === 'all' ? 'filter-option-selected' : ''}`}
                onClick={() => setSelectedHall('all')}
              >
                {t('schedule.all')}
              </button>
              {halls.map(hall => (
                <button
                  key={hall}
                  className={`filter-option ${selectedHall === hall ? 'filter-option-selected' : ''}`}
                  onClick={() => setSelectedHall(hall)}
                >
                  {hall}
                </button>
              ))}
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="reset-filters-btn" onClick={resetFilters}>
              {t('schedule.resetFilters')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ViewToggle Component
interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  const { t } = useTranslation();
  
  return (
    <div className="view-toggle-container">
      <span className="view-label">{t('schedule.viewAs')}:</span>
      <div className="view-toggle-buttons">
        <button 
          className={`view-toggle-btn ${viewMode === 'grid' ? 'view-toggle-selected' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          <FaThLarge /> {t('schedule.card')}
        </button>
        <button 
          className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-selected' : ''}`}
          onClick={() => setViewMode('list')}
        >
          <FaList /> {t('schedule.list')}
        </button>
      </div>
    </div>
  );
};

// ShowtimeItem Component
interface ShowtimeItemProps {
  showtime: MovieShowtime;
  handleBookingClick: (showtime: MovieShowtime) => void;
}

const ShowtimeItem: React.FC<ShowtimeItemProps> = ({ showtime, handleBookingClick }) => {
  const seatStatus = getSeatStatus(showtime.availableSeats, showtime.totalSeats);
  const showingTime = new Date(showtime.datetime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return (
    <div className="showtime-pill" onClick={() => handleBookingClick(showtime)}>
      <div className="showtime-pill-time">{showingTime}</div>
      <div className={`showtime-pill-status status-${seatStatus}`} />
      <div className="showtime-pill-format">{showtime.format}</div>
      <div className="showtime-pill-price">{showtime.price}</div>
    </div>
  );
};

// TimelineShowtimes component for grouped display
interface TimelineShowtimesProps {
  movieShowtimes: MovieShowtime[];
  handleBookingClick: (showtime: MovieShowtime) => void;
}

const TimelineShowtimes: React.FC<TimelineShowtimesProps> = ({ movieShowtimes, handleBookingClick }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const sortedShowtimes = [...movieShowtimes].sort((a, b) => 
    new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );
  
  // Group showtimes by hall
  const showtimesByHall: Record<string, MovieShowtime[]> = sortedShowtimes.reduce((acc, showtime) => {
    if (!acc[showtime.hall_name]) {
      acc[showtime.hall_name] = [];
    }
    acc[showtime.hall_name].push(showtime);
    return acc;
  }, {} as Record<string, MovieShowtime[]>);
  
  return (
    <div className="showtimes-timeline-container">
      {Object.entries(showtimesByHall).map(([hall, hallShowtimes]) => (
        <div key={hall} className="hall-timeline">
          <div className="hall-name">
            <FaMapMarkerAlt /> {hall}
          </div>
          <div className="showtime-pills">
            {hallShowtimes.map(showtime => (
              <ShowtimeItem 
                key={showtime.id} 
                showtime={showtime} 
                handleBookingClick={handleBookingClick} 
              />
            ))}
          </div>
        </div>
      ))}
      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-indicator status-high"></div>
          <span>{t('schedule.manySeats')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator status-medium"></div>
          <span>{t('schedule.someSeats')}</span>
        </div>
        <div className="legend-item">
          <div className="legend-indicator status-low"></div>
          <span>{t('schedule.fewSeats')}</span>
        </div>
      </div>
    </div>
  );
};

// MovieCard Component
interface MovieCardProps {
  movieId: string;
  movieShowtimes: MovieShowtime[];
  displayMovie: DisplayMovie | undefined;
  selectedDate: Date;
  currentLang: string;
  navigate: (path: string) => void;
  handleBookingClick: (showtime: MovieShowtime) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movieId, 
  movieShowtimes, 
  displayMovie, 
  selectedDate, 
  currentLang, 
  navigate,
  handleBookingClick
}) => {
  const movieTitle = displayMovie?.title || 
    (currentLang === 'ru' ? movieShowtimes[0]?.movie_title_ru : 
     currentLang === 'kg' ? movieShowtimes[0]?.movie_title_kg :
     movieShowtimes[0]?.movie_title_kg);
  
  const posterUrl = movieShowtimes[0]?.poster || 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434';
  
  return (
    <div className="movie-schedule-card">
      <div className="movie-card-header">
        <div className="movie-poster-container">
          <img 
            src={posterUrl}
            alt={movieTitle} 
            className="movie-poster"
            onClick={() => navigate(`/movies/${movieId}`)}
          />
        </div>
        
        <div className="movie-info">
          <h3 
            className="movie-title"
            onClick={() => navigate(`/movies/${movieId}`)}
          >
            {movieTitle}
          </h3>
          
          <div className="movie-meta">
            <span className="meta-item">
              <FaRegClock /> {movieShowtimes[0]?.language || 'KG'}
            </span>
            <span className="meta-item">
              <FaTags /> {movieShowtimes[0]?.format || '2D'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="showtime-date">
        <FaCalendarAlt className="date-icon" />
        {formatDate(selectedDate, 'EEEE, MMMM d', currentLang)}
      </div>
      
      <TimelineShowtimes 
        movieShowtimes={movieShowtimes}
        handleBookingClick={handleBookingClick}
      />
    </div>
  );
};

// NoShowtimes Component
const NoShowtimes: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="no-showtimes">
      <FaFilm className="no-showtimes-icon" />
      <h3 className="no-showtimes-title">{t('schedule.noShowtimes')}</h3>
      <p className="no-showtimes-message">{t('schedule.tryAnotherDay')}</p>
    </div>
  );
};

// Main Schedule Component
const Schedule: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { startNewBooking } = useBooking();
  
  // States
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedHall, setSelectedHall] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showtimes, setShowtimes] = useState<MovieShowtime[]>([]);
  const [displayMovies, setDisplayMovies] = useState<DisplayMovie[]>([]);
  const [calendarStartIndex, setCalendarStartIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  
  // Generate dates for calendar
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
  
  // Fetch movies and showtimes data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch showtimes for the selected date
        const formattedDate = selectedDate.toISOString().split('T')[0];
        let showtimesData: MovieShowtime[] = [];
        
        try {
          // Try to fetch from API first
          showtimesData = await showtimeService.getShowtimesByDate(formattedDate);
          console.log('Showtimes API response:', showtimesData);
        } catch (err) {
          console.log('Falling back to sample data');
          // If API fails, use sample data
          // Create mock showtimes based on sample movies
          showtimesData = generateMockShowtimesFromSampleMovies(selectedDate, sampleMovies);
        }
        
        if (!showtimesData.length) {
          // If still no data, create random showtimes for sample movies
          showtimesData = generateMockShowtimesFromSampleMovies(selectedDate, sampleMovies);
        }
        
        // Get all unique movie IDs from showtimes
        const movieIds = Array.from(new Set(showtimesData.map((st: MovieShowtime) => st.movie)));
        
        // Fetch all movies referenced by showtimes
        let moviesData: Movie[] = [];
        try {
          // Try to get movies from API
          moviesData = await Promise.all(movieIds.map((id) => movieService.getMovie(id as string)));
        } catch (error) {
          // Fallback to sample movies
          moviesData = sampleMovies.filter(movie => movieIds.includes(movie.id));
        }
        
        console.log('Movies data:', moviesData);
        
        // Map showtimes to include poster
        const enrichedShowtimes: MovieShowtime[] = showtimesData.map((st: MovieShowtime) => {
          const movie = moviesData.find((m: Movie) => m.id === st.movie) || 
                        sampleMovies.find((m) => m.id === st.movie);
          return {
            ...st,
            poster: movie?.poster || 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434',
          };
        });
        
        setShowtimes(enrichedShowtimes);
        
        // Prepare displayMovies for the UI
        setDisplayMovies(moviesData.map((movie: Movie) => ({
          id: movie.id,
          title: movie.title_kg,
          poster: movie.poster
        })));
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        // Fallback to mock data
        const mockShowtimes = generateMockShowtimesFromSampleMovies(selectedDate, sampleMovies);
        setShowtimes(mockShowtimes);
        setDisplayMovies(sampleMovies.map(movie => ({
          id: movie.id,
          title: movie.title_kg,
          poster: movie.poster
        })));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);
  
  // Filter showtimes based on selected date, format, and hall
  const filteredShowtimes = showtimes.filter(showtime => {
    const showingDate = new Date(showtime.datetime);
    const selectedDateStart = new Date(selectedDate);
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDate);
    selectedDateEnd.setHours(23, 59, 59, 999);
    
    return (
      showingDate >= selectedDateStart && 
      showingDate <= selectedDateEnd &&
      (selectedFormat === 'all' || showtime.format === selectedFormat) &&
      (selectedHall === 'all' || showtime.hall_name === selectedHall)
    );
  });
  
  // Group showtimes by movie
  const showtimesByMovie = filteredShowtimes.reduce((acc, showtime) => {
    if (!acc[showtime.movie]) {
      acc[showtime.movie] = [];
    }
    acc[showtime.movie].push(showtime);
    return acc;
  }, {} as Record<string, MovieShowtime[]>);
  
  // Get unique formats and halls for filters
  const formats = Array.from(new Set(showtimes.map(s => s.format)));
  const halls = Array.from(new Set(showtimes.map(s => s.hall_name)));
  
  // Reset filters
  const resetFilters = () => {
    setSelectedFormat('all');
    setSelectedHall('all');
  };

  const handleBookingClick = (showtime: MovieShowtime) => {
    // Clear any previous booking data when starting a new booking
    startNewBooking();
    
    // Store showtime data in localStorage
    localStorage.setItem('selectedShowtime', JSON.stringify(showtime));
    localStorage.setItem('currentShowtimeParams', JSON.stringify({
      id: showtime.id,
      movie: showtime.movie,
      title: currentLang === 'kg' ? showtime.movie_title_kg : showtime.movie_title_ru,
      time: new Date(showtime.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(showtime.datetime).toLocaleDateString(),
      hall: showtime.hall_name,
      format: showtime.format,
      poster: showtime.poster,
      language: showtime.language,
      price: showtime.price
    }));
    // Debug log
    console.log('Schedule: set selectedShowtime:', localStorage.getItem('selectedShowtime'));
    console.log('Schedule: set currentShowtimeParams:', localStorage.getItem('currentShowtimeParams'));
    navigate(`/booking/${showtime.id}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  return (
    <div className="schedule-page">
      <PageBanner title={t('nav.schedule')} />
      
      <div className="container-custom py-8">
        {/* Date Navigator */}
        <DateNavigator 
          dates={dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarStartIndex={calendarStartIndex}
          setCalendarStartIndex={setCalendarStartIndex}
          currentLang={currentLang}
        />
        
        {/* Filters Section */}
        <FiltersSection
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedHall={selectedHall}
          setSelectedHall={setSelectedHall}
          formats={formats}
          halls={halls}
          resetFilters={resetFilters}
        />
        
        {/* View Toggle */}
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        
        {/* Schedule Content */}
        <div className={viewMode === 'grid' ? 'schedule-grid' : 'schedule-list'}>
          {Object.keys(showtimesByMovie).length === 0 ? (
            <NoShowtimes />
          ) : (
            Object.entries(showtimesByMovie).map(([movieId, movieShowtimes]) => {
              const movie = displayMovies.find(m => m.id === movieId);
              return (
                <MovieCard
                  key={movieId}
                  movieId={movieId}
                  movieShowtimes={movieShowtimes}
                  displayMovie={movie}
                  selectedDate={selectedDate}
                  currentLang={currentLang}
                  navigate={navigate}
                  handleBookingClick={handleBookingClick}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;