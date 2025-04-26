import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { getGallery, GalleryItem } from '../../api/galleryService';
import LoadingSpinner from '../common/LoadingSpinner';

// Mock data for testing when API fails
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title_kg: 'Уңгуттуу Концерт',
    title_ru: 'Праздничный Концерт',
    description_kg: 'Коомчулуктун концерти биздин кинотеатрда өткөрүлдү.',
    description_ru: 'В нашем кинотеатре прошел общественный концерт.',
    image: 'https://source.unsplash.com/random/800x600/?concert',
    category: 'event',
    created_at: '2023-05-12T14:22:11Z'
  },
  // ...more mock items here
];

const Gallery: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const data = await getGallery();
        if (data && data.length > 0) {
          setGalleryItems(data);
        } else {
          // Use mock data if API returns empty response
          setGalleryItems(mockGalleryItems);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch gallery items:', error);
        setError(t('common.errorFetchingData'));
        // Use mock data if API fails
        setGalleryItems(mockGalleryItems);
        setLoading(false);
      }
    };
    
    fetchGalleryItems();
  }, [t]);

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  if (loading) {
    return <LoadingSpinner type="netflix" size="large" text={t('common.loading')} />;
  }
  
  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('nav.gallery')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div 
            key={item.id} 
            className="overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => openLightbox(item)}
          >
            <img 
              src={item.image} 
              alt={i18n.language === 'kg' ? item.title_kg : item.title_ru}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-white">
              <h3 className="text-xl font-semibold">
                {i18n.language === 'kg' ? item.title_kg : item.title_ru}
              </h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
            <button 
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors z-10"
              onClick={closeLightbox}
            >
              <FaTimes size={20} />
            </button>
            
            <div className="md:flex">
              <div className="md:w-2/3">
                <img 
                  src={selectedImage.image} 
                  alt={i18n.language === 'kg' ? selectedImage.title_kg : selectedImage.title_ru} 
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="md:w-1/3 p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {i18n.language === 'kg' ? selectedImage.title_kg : selectedImage.title_ru}
                </h2>
                <p className="text-gray-700">
                  {i18n.language === 'kg' ? selectedImage.description_kg : selectedImage.description_ru}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 