import { Movie } from '../api/movieService';

/**
 * Get the appropriate title for a movie based on current language
 */
export const getMovieTitle = (movie: Movie, currentLanguage: string): string => {
  if (currentLanguage === 'kg') return movie.title_kg;
  if (currentLanguage === 'ru') return movie.title_ru;
  // Default to Kyrgyz if other language
  return movie.title_kg;
};

/**
 * Get the appropriate synopsis for a movie based on current language
 */
export const getMovieSynopsis = (movie: Movie, currentLanguage: string): string => {
  if (currentLanguage === 'kg') return movie.synopsis_kg;
  if (currentLanguage === 'ru') return movie.synopsis_ru;
  // Default to Kyrgyz if other language
  return movie.synopsis_kg;
};

/**
 * Format movie details like year, genre, duration into a consistent string
 */
export const getMovieMetadata = (movie: Movie, minutesLabel: string): string => {
  return [
    new Date(movie.release_date).getFullYear(),
    movie.genre,
    `${movie.duration} ${minutesLabel}`,
  ].join(' • ');
}; 