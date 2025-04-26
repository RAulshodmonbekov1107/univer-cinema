import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaClock, FaFilter, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaTicketAlt, FaFilm, FaThLarge, FaList } from 'react-icons/fa';
import PageBanner from '../common/PageBanner';
import LoadingSpinner from '../common/LoadingSpinner';
import { Link } from 'react-router-dom';
import { movieService } from '../../api/movieService';

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

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Custom MovieShowtime interface
interface MovieShowtime {
  id: string;
  movieId: string;
  title: string;
  poster: string;
  date: Date;
  time: string;
  hall: string;
  format: string;
  language: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}

// Custom simplified movie interface for display
interface DisplayMovie {
  id: string;
  title: string;
  poster: string;
}

const Schedule: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  // States
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedHall, setSelectedHall] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showtimes, setShowtimes] = useState<MovieShowtime[]>([]);
  const [displayMovies, setDisplayMovies] = useState<DisplayMovie[]>([]);
  
  // Generate dates for calendar
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  
  // Fetch movies and showtimes data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data for showtimes
        const mockShowtimes: MovieShowtime[] = [
          {
            id: '1',
            movieId: '1',
            title: 'Жеңиш / Победа',
            poster: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: new Date(),
            time: '10:00',
            hall: 'Hall 1',
            format: '2D',
            language: 'kg',
            price: 250,
            availableSeats: 120,
            totalSeats: 150
          },
          {
            id: '2',
            movieId: '1',
            title: 'Жеңиш / Победа',
            poster: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: new Date(),
            time: '14:30',
            hall: 'Hall 2',
            format: '3D',
            language: 'kg',
            price: 300,
            availableSeats: 80,
            totalSeats: 120
          },
          {
            id: '3',
            movieId: '2',
            title: 'Боз Салкын',
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: new Date(),
            time: '12:15',
            hall: 'Hall 3',
            format: '2D',
            language: 'kg',
            price: 250,
            availableSeats: 30,
            totalSeats: 80
          },
          {
            id: '4',
            movieId: '3',
            title: 'Шамбала',
            poster: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: new Date(),
            time: '16:45',
            hall: 'Hall 1',
            format: 'IMAX',
            language: 'ru',
            price: 350,
            availableSeats: 140,
            totalSeats: 150
          },
          {
            id: '5',
            movieId: '4',
            title: 'Бүркүтчү кыз / Девочка-сокольница',
            poster: 'https://images.unsplash.com/photo-1562117532-085135df9311?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: new Date(),
            time: '19:00',
            hall: 'VIP Hall',
            format: '2D',
            language: 'en',
            price: 400,
            availableSeats: 3,
            totalSeats: 30
          },
          {
            id: '6',
            movieId: '5',
            title: 'Курманжан Датка',
            poster: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            date: addDays(new Date(), 1),
            time: '11:30',
            hall: 'Hall 2',
            format: '2D',
            language: 'kg',
            price: 250,
            availableSeats: 100,
            totalSeats: 120
          },
        ];

        // Fetch real movies (but not using the result in this component)
        await movieService.getMovies();
        
        // Simulate API call for showtimes
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set the mock showtimes data
        setShowtimes(mockShowtimes);
        
        // Extract unique movies from showtimes for display
        const uniqueMovies = Array.from(
          new Set(mockShowtimes.map(s => s.movieId))
        ).map(movieId => {
          const showtime = mockShowtimes.find(s => s.movieId === movieId);
          return {
            id: movieId,
            title: showtime?.title || '',
            poster: showtime?.poster || ''
          };
        });
        
        setDisplayMovies(uniqueMovies);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter showtimes based on selected date, format, and hall
  const filteredShowtimes = showtimes.filter(showtime => {
    return (
      isSameDay(showtime.date, selectedDate) &&
      (selectedFormat === 'all' || showtime.format === selectedFormat) &&
      (selectedHall === 'all' || showtime.hall === selectedHall)
    );
  });
  
  // Group showtimes by movie
  const showtimesByMovie = filteredShowtimes.reduce((acc, showtime) => {
    const movieId = showtime.movieId;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(showtime);
    return acc;
  }, {} as Record<string, MovieShowtime[]>);
  
  // Get unique formats and halls for filters
  const formats = Array.from(new Set(showtimes.map(s => s.format)));
  const halls = Array.from(new Set(showtimes.map(s => s.hall)));
  
  // Helper function for seat availability status
  const getSeatStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return 'high';
    if (percentage > 30) return 'medium';
    return 'low';
  };
  
  // Calculate calendar visible range
  const [calendarStartIndex, setCalendarStartIndex] = useState(0);
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
  
  // Reset filters
  const resetFilters = () => {
    setSelectedFormat('all');
    setSelectedHall('all');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PageBanner title={t('nav.schedule')} />
      
      <div className="container-custom py-12">
        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center text-gray-800">
              <FaCalendarAlt className="mr-2 text-primary" />
              {t('schedule.selectDate')}
            </h2>
            <div className="flex gap-2">
              {calendarStartIndex > 0 && (
                <button 
                  onClick={prevDates}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaChevronLeft />
                </button>
              )}
              {calendarStartIndex + 7 < dates.length && (
                <button 
                  onClick={nextDates}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {visibleDates.map((date, index) => {
              const isToday = isSameDay(date, new Date());
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    flex flex-col items-center p-3 rounded-lg transition-all
                    ${isSelected 
                      ? 'bg-primary text-white shadow-md transform scale-105' 
                      : isToday
                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                        : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-xs font-medium mb-1">
                    {formatDate(date, 'EEE', currentLang)}
                  </span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-white' : ''}`}>
                    {formatDate(date, 'd')}
                  </span>
                  <span className="text-xs mt-1">
                    {formatDate(date, 'MMM', currentLang)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Filters and View Toggle */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaFilter className="mr-2" />
              {t('schedule.filters')}
            </button>
            
            {showFilters && (
              <>
                <div className="bg-white shadow rounded-lg p-2 flex items-center">
                  <span className="text-sm font-medium mr-2 text-gray-600">{t('schedule.format')}:</span>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="bg-gray-100 border-none rounded p-1 text-sm focus:ring-primary"
                  >
                    <option value="all">{t('schedule.all')}</option>
                    {formats.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-white shadow rounded-lg p-2 flex items-center">
                  <span className="text-sm font-medium mr-2 text-gray-600">{t('schedule.hall')}:</span>
                  <select
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                    className="bg-gray-100 border-none rounded p-1 text-sm focus:ring-primary"
                  >
                    <option value="all">{t('schedule.all')}</option>
                    {halls.map(hall => (
                      <option key={hall} value={hall}>{hall}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={resetFilters}
                  className="text-primary hover:text-primary-dark text-sm font-medium"
                >
                  {t('schedule.resetFilters')}
                </button>
              </>
            )}
          </div>
          
          <div className="bg-white shadow rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <FaList />
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('schedule.legend')}</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm">{t('schedule.manySeats')}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-sm">{t('schedule.limitedSeats')}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-sm">{t('schedule.fewSeats')}</span>
            </div>
          </div>
        </div>
        
        {/* Showtimes */}
        {Object.keys(showtimesByMovie).length > 0 ? (
          <div 
            className={`grid grid-cols-1 gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}
          >
            {Object.entries(showtimesByMovie).map(([movieId, movieShowtimes]) => {
              const movie = displayMovies.find(m => m.id === movieId);
              
              return (
                <div 
                  key={movieId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
                >
                  {/* Movie Info */}
                  <div className={`flex ${viewMode === 'list' ? 'flex-row' : 'flex-col'}`}>
                    <div className={`${viewMode === 'list' ? 'w-1/3' : 'w-full h-48'} overflow-hidden`}>
                      <img 
                        src={movie?.poster} 
                        alt={movie?.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'w-2/3' : 'w-full'} p-4`}>
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{movie?.title}</h3>
                      
                      {/* Showtimes Grid */}
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                          <FaClock className="mr-1 text-primary" />
                          {formatDate(selectedDate, 'EEEE, MMMM d', currentLang)}
                        </h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {movieShowtimes.map(showtime => {
                            const seatStatus = getSeatStatus(showtime.availableSeats, showtime.totalSeats);
                            
                            return (
                              <Link
                                to={`/booking/${showtime.id}`}
                                key={showtime.id}
                                className="group block"
                              >
                                <div className={`
                                  border rounded-lg p-3 transition-all
                                  group-hover:border-primary group-hover:bg-primary/5
                                  flex flex-col items-center
                                `}>
                                  <div className="flex justify-between w-full">
                                    <span className="font-bold text-primary">{showtime.time}</span>
                                    <div className="flex items-center">
                                      <span className={`
                                        inline-block w-2 h-2 rounded-full mr-1
                                        ${seatStatus === 'high' ? 'bg-green-500' : 
                                          seatStatus === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}
                                      `}></span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-1 flex justify-between w-full text-sm">
                                    <div className="flex items-center">
                                      <FaMapMarkerAlt className="text-gray-400 mr-1" />
                                      <span className="text-gray-600">{showtime.hall}</span>
                                    </div>
                                    
                                    <span className="text-gray-600 font-medium">{showtime.format}</span>
                                  </div>
                                  
                                  <div className="mt-2 text-xs text-gray-500 w-full">
                                    <div className="flex justify-between">
                                      <span>{showtime.availableSeats} {t('schedule.seatsAvailable')}</span>
                                      <span className="font-medium">{showtime.price} с</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-2 w-full text-center">
                                    <span className="hidden group-hover:inline-block text-xs font-medium text-primary transition-all">
                                      <FaTicketAlt className="inline mr-1" />
                                      {t('common.bookTickets')}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-white p-8 rounded-xl shadow-md inline-block">
              <FaFilm className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('schedule.noShowtimes')}</h3>
              <p className="text-gray-500 mb-6">{t('schedule.tryAnotherDay')}</p>
              <button onClick={resetFilters} className="btn-primary">
                {t('schedule.resetFilters')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule; 