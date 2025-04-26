import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaTicketAlt, FaFilm } from 'react-icons/fa';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  text?: string;
  type?: 'circle' | 'ticket' | 'dots' | 'netflix';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white' | 'gray';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  text,
  type = 'netflix',
  size = 'medium',
  color = 'primary'
}) => {
  const { t } = useTranslation();
  const loadingText = text || t('common.loading');
  
  // Determine size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small': 
        return type === 'dots' ? 'space-x-1' : 'w-8 h-8';
      case 'large': 
        return type === 'dots' ? 'space-x-3' : 'w-16 h-16';
      default: 
        return type === 'dots' ? 'space-x-2' : 'w-12 h-12';
    }
  };
  
  // Determine size for dot
  const getDotSize = () => {
    switch (size) {
      case 'small': return 'w-1.5 h-1.5';
      case 'large': return 'w-4 h-4';
      default: return 'w-2.5 h-2.5';
    }
  };
  
  // Determine color classes
  const getColorClasses = () => {
    switch (color) {
      case 'white': 
        return 'border-white border-t-transparent text-white';
      case 'gray': 
        return 'border-gray-300 border-t-gray-600 text-gray-600';
      default: 
        return 'border-gray-300 border-t-primary text-primary';
    }
  };
  
  // Netflix-style loader
  const renderNetflixLoader = () => {
    return (
      <div className={`relative ${size === 'small' ? 'w-16 h-16' : size === 'large' ? 'w-32 h-32' : 'w-24 h-24'}`}>
        <style>
          {`
            @keyframes netflixLoader {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }

            .netflix-loader div {
              position: absolute;
              animation: netflixLoader 1s linear infinite;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              box-sizing: border-box;
              border: 3px solid transparent;
            }

            .netflix-loader div:nth-child(1) {
              border-top-color: #D32F2F;
            }

            .netflix-loader div:nth-child(2) {
              border-bottom-color: #D32F2F;
              animation-delay: 0.25s;
            }

            .netflix-loader div:nth-child(3) {
              border-left-color: #D32F2F;
              animation-delay: 0.5s;
            }

            .netflix-loader div:nth-child(4) {
              border-right-color: #D32F2F;
              animation-delay: 0.75s;
            }
          `}
        </style>
        <div className="netflix-loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  };
  
  // Render appropriate spinner type
  const renderSpinner = () => {
    switch (type) {
      case 'netflix':
        return renderNetflixLoader();
        
      case 'ticket':
        return (
          <div className={`relative ${getSizeClasses()}`}>
            <FaTicketAlt 
              className={`absolute inset-0 ${getColorClasses()} animate-ping opacity-50`} 
              size="100%" 
            />
            <FaTicketAlt 
              className={`absolute inset-0 ${getColorClasses()}`} 
              size="100%" 
            />
            <div className="absolute -top-1/4 left-1/2 -translate-x-1/2">
              <FaFilm 
                className={`${getColorClasses()} animate-spin`} 
                size={size === 'large' ? 24 : size === 'small' ? 12 : 16} 
              />
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={`flex ${getSizeClasses()}`}>
            <div className={`${getDotSize()} bg-current rounded-full animate-bounce delay-0 ${getColorClasses()}`}></div>
            <div className={`${getDotSize()} bg-current rounded-full animate-bounce delay-150 ${getColorClasses()}`}></div>
            <div className={`${getDotSize()} bg-current rounded-full animate-bounce delay-300 ${getColorClasses()}`}></div>
          </div>
        );
      
      default:
        return (
          <div className={`rounded-full border-4 ${getSizeClasses()} ${getColorClasses()} animate-spin`}></div>
        );
    }
  };
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-50 transition-opacity duration-300">
        {renderSpinner()}
        <p className={`font-medium mt-6 text-white`}>{loadingText}</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {renderSpinner()}
      <p className={`mt-4 ${color === 'primary' ? 'text-gray-600' : `text-${color}`}`}>{loadingText}</p>
    </div>
  );
};

export default LoadingSpinner; 