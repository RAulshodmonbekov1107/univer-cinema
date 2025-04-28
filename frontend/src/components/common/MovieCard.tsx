import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Movie } from '../../api/movieService';
import { FaPlay, FaCalendarAlt, FaClock, FaLanguage, FaTicketAlt } from 'react-icons/fa';

interface MovieCardProps {
  movie: Movie;
  animation?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper function to get language display text
  const getLanguageDisplay = (langCode: string) => {
    switch (langCode) {
      case 'kg': return t('languages.kyrgyz');
      case 'ru': return t('languages.russian');
      case 'en': return t('languages.english');
      default: return t('languages.other');
    }
  };
  
  // Helper to get a label for foreign films
  const isForeignFilm = movie.language !== 'kg' && movie.language !== 'ru';
  
  // Use poster_url if available, otherwise fall back to poster
  const posterSrc = movie.poster_url || movie.poster;
  
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="block movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full flex flex-col">
        <div className="relative overflow-hidden group h-80">
          <img
            src={posterSrc}
            alt={currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
          
          {/* Language badge */}
          <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaLanguage className="mr-1" />
            {getLanguageDisplay(movie.language)}
            {isForeignFilm && <span className="ml-1">🌍</span>}
          </div>
          
          {/* Duration badge */}
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <FaClock className="mr-1" />
            {movie.duration} {t('movies.minutes')}
          </div>
          
          {/* Trailer play button */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-primary/90 text-white rounded-full p-3">
              <FaPlay size={24} />
            </div>
          </div>
          
          {/* Title area */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-bold text-xl truncate">
              {currentLanguage === 'kg' ? movie.title_kg : movie.title_ru}
            </h3>
            <div className="flex justify-between text-white/90 text-sm mt-1">
              <span className="bg-black/30 px-2 py-0.5 rounded">{movie.genre}</span>
              <span className="bg-black/30 px-2 py-0.5 rounded flex items-center">
                <FaCalendarAlt className="mr-1" />
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Card footer with synopsis and CTA */}
        <div className="p-4 bg-white flex-grow flex flex-col justify-between">
          <p className="text-gray-600 line-clamp-2 text-sm mb-4">
            {currentLanguage === 'kg' ? movie.synopsis_kg : movie.synopsis_ru}
          </p>
          <button className="btn-primary w-full flex items-center justify-center">
            <FaTicketAlt className="mr-2" />
            {t('movies.bookNow')}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 