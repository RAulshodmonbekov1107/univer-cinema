import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight, FaPlay, FaTicketAlt } from 'react-icons/fa';
import { Movie } from '../../api/movieService';

interface CarouselProps {
  movies: Movie[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
  movies, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  
  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, movies.length]);
  
  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning, movies.length]);
  
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [isTransitioning]);
  
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, interval);
    
    return () => clearInterval(timer);
  }, [autoPlay, interval, handleNext]);
  
  if (!movies.length) return null;
  
  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative h-full">
            <img
              src={movie.poster}
              alt={currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
              className="w-full h-full object-cover"
            />
            
            {/* Dynamic gradient overlay */}
            <div className="absolute inset-0 cinema-gradient opacity-80"></div>
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Text content */}
                  <div className={`${index === currentIndex ? 'animate-slide-right' : ''}`}>
                    <span className="inline-block px-3 py-1 bg-white/10 text-white/90 text-sm rounded-full mb-4">
                      {movie.genre}
                    </span>
                    <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                      {currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
                    </h2>
                    <div className="flex items-center text-white/80 space-x-4 mb-6">
                      <span className="flex items-center">
                        <FaPlay className="mr-2" />
                        {movie.language}
                      </span>
                      <span>|</span>
                      <span>{movie.duration} {t('movies.minutes')}</span>
                      <span>|</span>
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    <p className="text-white/90 text-lg mb-8 line-clamp-3 max-w-xl">
                      {currentLanguage === 'kg' ? movie.synopsis_kg : movie.synopsis_ru}
                    </p>
                    <div className="flex flex-wrap space-x-4">
                      <Link 
                        to={`/movies/${movie.id}`} 
                        className="btn-primary flex items-center mb-2"
                      >
                        <FaTicketAlt className="mr-2" />
                        {t('movies.bookNow')}
                      </Link>
                      <a 
                        href={movie.trailer} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-outline flex items-center mb-2"
                      >
                        <FaPlay className="mr-2" />
                        {t('movies.trailer')}
                      </a>
                    </div>
                  </div>
                  
                  {/* Optional: Poster image in a frame */}
                  <div className="hidden md:block">
                    <div className={`relative rounded-lg overflow-hidden shadow-2xl transform transition-all duration-700 ${
                      index === currentIndex ? 'scale-100 opacity-100 animate-slide-left' : 'scale-95 opacity-0'
                    }`}>
                      <img 
                        src={movie.poster} 
                        alt={currentLanguage === 'kg' ? movie.title_kg : movie.title_ru} 
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 ring-1 ring-white/20 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-primary text-white p-3 rounded-full transition-colors"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-black/30 hover:bg-primary text-white p-3 rounded-full transition-colors"
        aria-label="Next slide"
      >
        <FaChevronRight size={20} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'w-10 bg-primary' 
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 