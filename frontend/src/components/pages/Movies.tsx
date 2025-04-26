import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaSearch, FaRegCalendarAlt, FaTimes, FaStar } from 'react-icons/fa';
import MovieCard from '../common/MovieCard';
import LoadingSpinner from '../common/LoadingSpinner';
import PageBanner from '../common/PageBanner';
import { movieService, Movie } from '../../api/movieService';

const Movies: React.FC = () => {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showingFilter, setShowingFilter] = useState<'all' | 'now' | 'coming'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Animation classes
  const staggerAnimation = (index: number) => `animate-fade-in animate-delay-${index * 100}`;
  
  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const moviesData = await movieService.getMovies();
        setMovies(moviesData);
        setFilteredMovies(moviesData);
      } catch (err) {
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, []);
  
  // Extract unique genres from movies
  const allGenres = Array.from(new Set(movies.map(movie => movie.genre)));
  
  // Filter movies when filters change
  const applyFilters = useCallback(() => {
    let result = [...movies];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(movie => 
        movie.title_kg.toLowerCase().includes(query) || 
        movie.title_ru.toLowerCase().includes(query)
      );
    }
    
    // Apply genre filter
    if (selectedGenres.length > 0) {
      result = result.filter(movie => selectedGenres.includes(movie.genre));
    }
    
    // Apply showing filter
    if (showingFilter !== 'all') {
      result = result.filter(movie => 
        showingFilter === 'now' ? movie.is_showing : !movie.is_showing
      );
    }
    
    setFilteredMovies(result);
  }, [movies, searchQuery, selectedGenres, showingFilter]);
  
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setShowingFilter('all');
  };
  
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner title={t('nav.movies')} />
      
      <div className="container-custom py-10">
        {/* Top Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('movies.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowingFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showingFilter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('movies.allMovies')}
              </button>
              <button
                onClick={() => setShowingFilter('now')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  showingFilter === 'now' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaStar className="mr-2" />
                {t('home.nowShowing')}
              </button>
              <button
                onClick={() => setShowingFilter('coming')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  showingFilter === 'coming' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaRegCalendarAlt className="mr-2" />
                {t('home.comingSoon')}
              </button>
              
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 flex items-center"
              >
                <FaFilter className="mr-2" />
                {t('movies.filters')}
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {filtersOpen && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
              <h3 className="font-medium mb-4">{t('movies.genres')}</h3>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  {t('movies.clearFilters')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie, index) => (
              <div key={movie.id} className={staggerAnimation(index % 12)}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white p-8 rounded-xl shadow-md inline-block">
              <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('movies.noResults')}</h3>
              <p className="text-gray-500 mb-6">{t('movies.tryAdjustingFilters')}</p>
              <button onClick={clearFilters} className="btn-primary">
                {t('movies.clearFilters')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies; 