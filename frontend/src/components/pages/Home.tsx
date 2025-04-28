import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaTicketAlt, FaFilm, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import Carousel from '../common/Carousel';
import MovieCard from '../common/MovieCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { movieService, Movie } from '../../api/movieService';
import HeroSection from '../common/HeroSection';
import { useBooking } from '../../contexts/BookingContext';
import './Home.css';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { startNewBooking } = useBooking();
  
  useEffect(() => {
    // Clear any previous booking data when landing on the homepage
    // This ensures we don't have stale booking data when starting a new booking
    startNewBooking();
    
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        // Try to fetch real data from the API
        const nowShowingResponse = await movieService.getNowShowing();
        if (nowShowingResponse && nowShowingResponse.length > 0) {
          setMovies(nowShowingResponse);
        } else {
          setMovies([]);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load movies. Please try again later.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [currentLanguage]);
  
  if (loading) {
    return <LoadingSpinner size="large" />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white">
        <div className="bg-white/10 p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <button className="btn-primary" onClick={() => window.location.reload()}>{t('common.refresh')}</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="home-container">
      {/* Hero Section with Video Background */}
      <HeroSection 
        videoSrc="/videos/cinema-background.mp4"
        posterSrc={movies[0]?.poster}
      />
      
      {/* Featured Movies */}
      <section className="py-16 bg-gradient-to-b from-dark to-dark/90">
        {/* Featured Movies Carousel */}
        {movies.length > 0 && (
          <Carousel movies={movies} />
        )}
      </section>
      
      {/* Now Showing Section */}
      <section className="now-showing-section py-14 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="section-header flex justify-between items-center mb-10">
            <div className="flex items-center">
              <FaFilm className="text-primary mr-3 text-2xl" />
              <h2 className="text-3xl font-bold">{t('home.nowShowing')}</h2>
            </div>
            <Link to="/movies" className="view-all-link group flex items-center text-primary hover:text-red-700 font-medium transition-colors">
              {t('home.viewAll')}
              <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          {movies.length > 0 ? (
            <div className="movie-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {movies.slice(0, 4).map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  animation="" 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white p-8 rounded-xl shadow-md inline-block">
                <p className="text-gray-500 mb-4">{t('movies.noMoviesFound')}</p>
                <button className="btn-primary">
                  {t('common.refresh')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Cultural Spotlight Section */}
      <section className="cultural-section py-16 cinema-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-20 bg-cover bg-center"></div>
        
        <div className="container-custom relative z-10">
          <div className="section-title text-center mb-10">
            <span className="badge inline-block px-4 py-1 bg-white/10 text-white rounded-full mb-4">
              {t('home.cultural')}
            </span>
            <h2 className="text-4xl font-bold mb-4">{t('home.culturalSpotlight')}</h2>
            <p className="section-description text-white/80 max-w-3xl mx-auto">
              {currentLanguage === 'kg'
                ? 'Кыргыз кинематографиясынын мыкты үлгүлөрү менен таанышып, улуттук киноискусствонун бай мурасын ачыңыз.'
                : 'Познакомьтесь с лучшими образцами кыргызской кинематографии и откройте для себя богатое наследие национального киноискусства.'}
            </p>
          </div>
          
          <div className="cultural-grid flex flex-col md:flex-row items-center justify-center mb-8">
            <div className="featured-cultural w-full md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Kurmanjan Datka" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold">
                    {currentLanguage === 'kg' ? "Курманжан Датка" : "Курманжан Датка: Королева гор"}
                  </h3>
                  <p className="text-white/80 mt-2">
                    {currentLanguage === 'kg'
                      ? "Кыргыз элинин улуу кызы жөнүндө тарыхый эпос"
                      : "Исторический эпос о великой дочери кыргызского народа"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="weekly-highlights w-full md:w-1/2">
              <div className="highlights-container bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">{t('home.weeklyHighlights')}</h3>
                
                <div className="highlights-list space-y-4">
                  {movies.slice(0, 3).map((movie, index) => (
                    <Link 
                      key={movie.id}
                      to={`/movies/${movie.id}`}
                      className="highlight-item flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <img 
                        src={movie.poster} 
                        alt={currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
                        className="w-16 h-20 object-cover rounded-md mr-4" 
                      />
                      <div className="flex-1">
                        <h4 className="font-bold">
                          {currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {movie.genre} | {movie.duration} {t('movies.minutes')}
                        </p>
                      </div>
                      <div className="text-white/50 hover:text-white transition-colors">
                        <FaArrowRight />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/cultural" className="discover-more-btn btn-outline border-white text-white hover:bg-white hover:text-primary inline-flex items-center">
              <FaInfoCircle className="mr-2" />
              {t('home.discoverMore')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Coming Soon Section */}
      <section className="py-14">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center">
              <FaCalendarAlt className="text-primary mr-3 text-2xl" />
              <h2 className="text-3xl font-bold">{t('home.comingSoon')}</h2>
            </div>
            <Link to="/movies" className="group flex items-center text-primary hover:text-red-700 font-medium transition-colors">
              {t('home.viewAll')}
              <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {movies.slice(0, 4).map((movie, index) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  animation=""
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 p-8 rounded-xl inline-block">
                <p className="text-gray-500">{t('movies.noMoviesFound')}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden about-section">
        {/* Decorative red particles */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-primary/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 inline-block relative">
                {t('home.aboutUs')}
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Univer Cinema - это современный кинотеатр в городе Нарын, предлагающий высококачественное кинематографическое развлечение для всей семьи. Наша миссия - обогатить культурную жизнь Нарына, представляя лучшие фильмы на кыргызском и русском языках.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Мы оснащены новейшими технологиями кинопоказа, удобными креслами и предлагаем широкий выбор закусок для полного погружения в мир кино.
              </p>
              <Link to="/about" className="btn-cta inline-flex items-center group">
                <FaInfoCircle />
                {t('nav.about')}
                <FaArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="cinema-image rounded-2xl overflow-hidden shadow-2xl transform md:rotate-3 transition-transform duration-700 relative">
                <img 
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Cinema Interior" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl"></div>
                
                {/* Ticket shape clip overlay */}
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="btn-primary">
                    <FaTicketAlt className="mr-2" />
                    {t('common.bookTickets')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials/Reviews Section */}
      <section className="py-16 bg-gray-50 testimonials-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.testimonials')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.testimonialsText')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="testimonial-card"
              >
                <div className="testimonial-content">
                  <p className="text-gray-600">
                    Отличный кинотеатр с прекрасным звуком и изображением. Удобные кресла и дружелюбный персонал. Обязательно вернусь снова!
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    A{item}
                  </div>
                  <div className="testimonial-info">
                    <h3 className="testimonial-name">Анонимный посетитель</h3>
                    <p className="testimonial-date">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 