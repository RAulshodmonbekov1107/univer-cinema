import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  image?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: 'light' | 'dark' | 'gradient' | 'none';
  align?: 'left' | 'center' | 'right';
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const PageBanner: React.FC<PageBannerProps> = ({ 
  title, 
  subtitle,
  image = '/images/cinema-banner.jpg',
  size = 'medium',
  overlay = 'gradient',
  align = 'center',
  breadcrumbs
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  
  // Get height based on size
  const getHeight = () => {
    switch (size) {
      case 'small': return 'h-48 md:h-56';
      case 'large': return 'h-96 md:h-[500px]';
      default: return 'h-64 md:h-80';
    }
  };
  
  // Get overlay styling
  const getOverlay = () => {
    switch (overlay) {
      case 'light': return 'bg-white/60';
      case 'dark': return 'bg-black/70';
      case 'gradient': return 'bg-gradient-to-r from-primary/80 to-black/80';
      default: return '';
    }
  };
  
  // Get alignment class
  const getAlignment = () => {
    switch (align) {
      case 'left': return 'text-left';
      case 'right': return 'text-right';
      default: return 'text-center';
    }
  };
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="relative overflow-hidden">
      <div 
        className={`${getHeight()} bg-cover bg-center relative`}
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Fixed position background to enable parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${image})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center 20%',
          }}
        ></div>
        
        {/* Overlay */}
        <div className={`absolute inset-0 ${getOverlay()}`}></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className={`container-custom ${getAlignment()}`}>
            {breadcrumbs && (
              <div className={`mb-6 text-sm text-white/80 animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <ul className="flex flex-wrap items-center justify-center space-x-2">
                  <li>
                    <a href="/" className="hover:text-white transition-colors">
                      {t('nav.home')}
                    </a>
                  </li>
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={item.path}>
                      <li className="text-white/50">/</li>
                      <li>
                        {index === breadcrumbs.length - 1 ? (
                          <span className="text-white">{item.label}</span>
                        ) : (
                          <a href={item.path} className="hover:text-white transition-colors">
                            {item.label}
                          </a>
                        )}
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}
            
            <h1 
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              {title}
            </h1>
            
            {subtitle && (
              <p 
                className={`text-white/90 text-lg md:text-xl max-w-3xl mx-auto transform transition-all duration-700 delay-300 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                {subtitle}
              </p>
            )}
            
            {/* Optional decorative element */}
            <div 
              className={`w-24 h-1 bg-primary rounded-full mt-6 mx-auto transition-all duration-1000 ${
                isVisible ? 'w-24 opacity-100' : 'w-0 opacity-0'
              }`}
              style={{ display: align === 'center' ? 'block' : 'none' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBanner; 