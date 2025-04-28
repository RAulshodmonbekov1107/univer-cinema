import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FaTimes, 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaVideo, 
  FaCamera, 
  FaCalendarAlt, 
  FaImage,
  FaFilm,
  FaUsers,
  FaGraduationCap,
  FaTheaterMasks
} from 'react-icons/fa';
import { getGallery, GalleryItem } from '../../api/galleryService';
import PageBanner from '../common/PageBanner';
import './Gallery.css';
import { ImSpinner9 } from 'react-icons/im';

// Mock data for fallback if API fails
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title_kg: 'Кинопремьера "Бойцовский клуб"',
    title_ru: 'Кинопремьера "Бойцовский клуб"',
    description_kg: 'Премьера культового фильма в нашем кинотеатре с дискуссией после показа.',
    description_ru: 'Премьера культового фильма в нашем кинотеатре с дискуссией после показа.',
    image: '/images/gallery/premiere1.jpg',
    image_url: '/images/gallery/premiere1.jpg',
    caption_kg: 'Премьера фильма',
    caption_ru: 'Премьера фильма',
    created_at: '2023-05-15',
    category: 'premieres',
  },
  {
    id: '2',
    title_kg: 'Открытие нового зала',
    title_ru: 'Открытие нового зала',
    description_kg: 'Торжественное открытие нового VIP-зала с технологией IMAX.',
    description_ru: 'Торжественное открытие нового VIP-зала с технологией IMAX.',
    image: '/images/gallery/event1.jpg',
    image_url: '/images/gallery/event1.jpg',
    caption_kg: 'Открытие нового зала',
    caption_ru: 'Открытие нового зала',
    created_at: '2023-04-20',
    category: 'events',
  },
  {
    id: '3',
    title_kg: 'Мастер-класс по анимации',
    title_ru: 'Мастер-класс по анимации',
    description_kg: 'Интерактивный мастер-класс по созданию анимации от ведущих аниматоров студии Pixar.',
    description_ru: 'Интерактивный мастер-класс по созданию анимации от ведущих аниматоров студии Pixar.',
    image: '/images/gallery/workshop1.jpg',
    image_url: '/images/gallery/workshop1.jpg',
    caption_kg: 'Мастер-класс',
    caption_ru: 'Мастер-класс',
    created_at: '2023-03-10',
    category: 'workshops',
  },
  {
    id: '4',
    title_kg: 'Фестиваль короткометражек',
    title_ru: 'Фестиваль короткометражек',
    description_kg: 'Ежегодный фестиваль студенческих короткометражных фильмов.',
    description_ru: 'Ежегодный фестиваль студенческих короткометражных фильмов.',
    image: '/images/gallery/festival1.jpg',
    image_url: '/images/gallery/festival1.jpg',
    caption_kg: 'Фестиваль',
    caption_ru: 'Фестиваль',
    created_at: '2023-06-05',
    category: 'festivals',
  },
  {
    id: '5',
    title_kg: 'Встреча с режиссером',
    title_ru: 'Встреча с режиссером',
    description_kg: 'Творческая встреча с известным кыргызским режиссером после показа его нового фильма.',
    description_ru: 'Творческая встреча с известным кыргызским режиссером после показа его нового фильма.',
    image: '/images/gallery/meeting1.jpg',
    image_url: '/images/gallery/meeting1.jpg',
    caption_kg: 'Встреча',
    caption_ru: 'Встреча',
    created_at: '2023-02-28',
    category: 'meetings',
  },
  {
    id: '6',
    title_kg: 'Ретроспектива фильмов Хичкока',
    title_ru: 'Ретроспектива фильмов Хичкока',
    description_kg: 'Неделя классических триллеров Альфреда Хичкока с лекциями перед показами.',
    description_ru: 'Неделя классических триллеров Альфреда Хичкока с лекциями перед показами.',
    image: '/images/gallery/retrospective1.jpg',
    image_url: '/images/gallery/retrospective1.jpg',
    caption_kg: 'Ретроспектива',
    caption_ru: 'Ретроспектива',
    created_at: '2023-07-12',
    category: 'retrospectives',
  },
  {
    id: '7',
    title_kg: 'Детский киноклуб',
    title_ru: 'Детский киноклуб',
    description_kg: 'Еженедельные встречи детского киноклуба с показами и обсуждениями мультфильмов.',
    description_ru: 'Еженедельные встречи детского киноклуба с показами и обсуждениями мультфильмов.',
    image: '/images/gallery/kids1.jpg',
    image_url: '/images/gallery/kids1.jpg',
    caption_kg: 'Детский клуб',
    caption_ru: 'Детский клуб',
    created_at: '2023-01-15',
    category: 'kids',
  },
  {
    id: '8',
    title_kg: 'Кинодискуссия',
    title_ru: 'Кинодискуссия',
    description_kg: 'Открытая дискуссия о влиянии современного кинематографа на общество.',
    description_ru: 'Открытая дискуссия о влиянии современного кинематографа на общество.',
    image: '/images/gallery/discussion1.jpg',
    image_url: '/images/gallery/discussion1.jpg',
    caption_kg: 'Дискуссия',
    caption_ru: 'Дискуссия',
    created_at: '2023-08-03',
    category: 'discussions',
  },
  {
    id: '9',
    title_kg: 'Открытие летней площадки',
    title_ru: 'Открытие летней площадки',
    description_kg: 'Открытие сезона кинопоказов под открытым небом.',
    description_ru: 'Открытие сезона кинопоказов под открытым небом.',
    image: '/images/gallery/outdoor1.jpg',
    image_url: '/images/gallery/outdoor1.jpg',
    caption_kg: 'Летняя площадка',
    caption_ru: 'Летняя площадка',
    created_at: '2023-06-20',
    category: 'outdoor',
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'events':
    case 'event':
      return <FaStar className="category-icon" />;
    case 'premieres':
    case 'premiere':
      return <FaVideo className="category-icon" />;
    case 'festivals':
      return <FaCalendarAlt className="category-icon" />;
    case 'workshops':
      return <FaGraduationCap className="category-icon" />;
    case 'discussions':
      return <FaUsers className="category-icon" />;
    case 'retrospectives':
      return <FaFilm className="category-icon" />;
    case 'meetings':
      return <FaTheaterMasks className="category-icon" />;
    default:
      return <FaCamera className="category-icon" />;
  }
};

// Function to determine if an item should be featured based on some criteria
const shouldFeatureItem = (item: GalleryItem, index: number): boolean => {
  // Feature every 4th item, and items with special categories
  return index % 4 === 0 || 
         item.category === 'premieres' || 
         item.category === 'festivals';
};

const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const categories = [
    { key: 'all', label: t('gallery.all') },
    { key: 'events', label: t('gallery.events') },
    { key: 'premieres', label: t('gallery.premieres') },
    { key: 'festivals', label: t('gallery.festivals') },
    { key: 'workshops', label: t('gallery.workshops') },
    { key: 'venue', label: t('gallery.venue') }
  ];

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true);
      try {
        console.log("Fetching gallery items...");
        const items = await getGallery();
        console.log("Gallery items fetched:", items);
        
        // Process each item to ensure valid URLs and handle errors
        const validatedItems = items.map(item => {
          console.log("Processing item:", item);
          return {
            ...item,
            // Ensure image_url is a valid URL
            image_url: item.image_url 
              ? (item.image_url.startsWith('http') 
                ? item.image_url 
                : `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${item.image_url}`)
              : '/placeholder-image.jpg',
          };
        });
        
        console.log("Validated gallery items:", validatedItems);
        setGalleryItems(validatedItems);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        // In case of error, set mock data
        setGalleryItems(mockGalleryItems);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleFilterChange = (filter: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setIsTransitioning(false);
    }, 300);
  };

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => {
        // Handle both singular and plural category names (event/events)
        const itemCategory = item.category || 'events';
        if (activeFilter === 'events' && itemCategory === 'event') return true;
        if (activeFilter === 'premieres' && itemCategory === 'premiere') return true;
        return itemCategory === activeFilter;
      });

  const handleImageError = (id: string) => {
    console.log(`Image error for item ${id}`);
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === 0 
        ? filteredItems.length - 1 
        : selectedImageIndex - 1
    );
  }, [selectedImageIndex, filteredItems.length]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(
      selectedImageIndex === filteredItems.length - 1 
        ? 0 
        : selectedImageIndex + 1
    );
  }, [selectedImageIndex, filteredItems.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, goToPrevious, goToNext, closeLightbox]);
  
  if (loading) {
    return (
      <div className="gallery-loading">
        <ImSpinner9 className="spinner" />
        <p>Loading gallery...</p>
      </div>
    );
  }
  
  return (
    <div className="gallery-page">
      <PageBanner title={t('nav.gallery')} />
      
      <div className="gallery-container">
        <div className="gallery-header">
          <h1 className="gallery-title">{t('gallery.title')}</h1>
          <p className="gallery-description">{t('gallery.description')}</p>
        </div>
        
        <div className="gallery-filters">
          {categories.map(category => (
            <button 
              key={category.key}
              className={`filter-button ${activeFilter === category.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(category.key)}
              aria-label={`Filter by ${category.label}`}
            >
              {category.label}
            </button>
          ))}
        </div>
        
        <div className={`gallery-grid ${isTransitioning ? 'transitioning' : ''}`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isFeatured = shouldFeatureItem(item, index);
              return (
                <div 
                  key={item.id} 
                  className={`gallery-item ${isFeatured ? 'featured' : ''}`}
                  onClick={() => openLightbox(index)}
                  style={{ 
                    '--index': index,
                    animationDelay: `${index * 0.08}s`
                  } as React.CSSProperties}
                  aria-label={i18n.language === 'kg' ? item.title_kg : item.title_ru}
                >
                  <div className="gallery-item-inner">
                    {imageErrors[item.id] ? (
                      <div className="gallery-placeholder">
                        <FaImage />
                        <p>Image not available</p>
                      </div>
                    ) : (
                      <img 
                        src={item.image_url}
                        alt={i18n.language === 'kg' ? item.title_kg : item.title_ru}
                        className={`gallery-image ${imageErrors[item.id] ? 'error' : ''}`}
                        loading="lazy"
                        onError={() => handleImageError(item.id)}
                      />
                    )}
                    <div className="gallery-overlay">
                      {getCategoryIcon(item.category || 'events')}
                      <h3 className="gallery-item-title">
                        {i18n.language === 'kg' ? 
                          (item.title_kg || item.caption_kg || t('gallery.noTitle')) : 
                          (item.title_ru || item.caption_ru || t('gallery.noTitle'))}
                      </h3>
                      <span className="gallery-item-category">
                        {t(`gallery.${item.category || 'events'}`)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-items-message">
              <FaImage size={48} />
              <p>{t('gallery.noItems')}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button 
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <FaTimes />
            </button>
            
            <button 
              className="lightbox-nav lightbox-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            
            <div className="lightbox-image-container">
              <img 
                src={filteredItems[selectedImageIndex].image_url} 
                alt={i18n.language === 'kg' 
                  ? filteredItems[selectedImageIndex].title_kg || filteredItems[selectedImageIndex].caption_kg
                  : filteredItems[selectedImageIndex].title_ru || filteredItems[selectedImageIndex].caption_ru} 
                className="lightbox-image"
                onError={() => handleImageError(filteredItems[selectedImageIndex].id)}
              />
            </div>
            
            <button 
              className="lightbox-nav lightbox-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
            
            <div className="lightbox-details">
              <h2 className="lightbox-title">
                {i18n.language === 'kg' 
                  ? filteredItems[selectedImageIndex].title_kg || filteredItems[selectedImageIndex].caption_kg
                  : filteredItems[selectedImageIndex].title_ru || filteredItems[selectedImageIndex].caption_ru}
              </h2>
              <p className="lightbox-description">
                {i18n.language === 'kg' 
                  ? filteredItems[selectedImageIndex].description_kg || filteredItems[selectedImageIndex].caption_kg
                  : filteredItems[selectedImageIndex].description_ru || filteredItems[selectedImageIndex].caption_ru}
              </p>
              <div className="lightbox-metadata">
                <span className="lightbox-category">
                  {t(`gallery.${filteredItems[selectedImageIndex].category || 'events'}`)}
                </span>
                <span className="lightbox-date">
                  {new Date(filteredItems[selectedImageIndex].created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 