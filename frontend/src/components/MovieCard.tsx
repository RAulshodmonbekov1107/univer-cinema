import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../api/movieService';
import './MovieCard.css';
import { FaStar } from 'react-icons/fa';
import placeholderImage from '../assets/movie-placeholder.jpg';

interface MovieCardProps {
  movie: Movie;
  showRating?: boolean;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  showRating = false,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Use poster_url if available, otherwise fall back to poster
  const posterSrc = movie.poster_url || movie.poster || placeholderImage;

  return (
    <div className={`movie-card ${className}`}>
      <Link to={`/movies/${movie.id}`} className="movie-card-link">
        <div className="movie-card-poster">
          <img 
            src={!imageError ? posterSrc : placeholderImage}
            alt={movie.title_ru || movie.title_kg}
            onError={handleImageError}
          />
          {movie.is_showing && (
            <div className="movie-badge">Now Showing</div>
          )}
          {!movie.is_showing && (
            <div className="movie-badge coming-soon">Coming Soon</div>
          )}
          {showRating && (
            <div className="movie-rating">
              <FaStar />
              <span>4.5</span>
            </div>
          )}
        </div>
        <div className="movie-card-info">
          <h3 className="movie-title">{movie.title_ru || movie.title_kg}</h3>
          <div className="movie-details">
            <span className="movie-genre">{movie.genre}</span>
            <span className="movie-duration">{movie.duration} min</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard; 