import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaPlay } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

interface HeroSectionProps {
  videoSrc: string;
  posterSrc?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ videoSrc, posterSrc }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Handle video load errors
      const handleError = () => {
        console.error('Video failed to load:', videoSrc);
        setVideoError(true);
        setVideoLoading(false);
      };

      const handleLoadedData = () => {
        setVideoLoading(false);
      };

      videoElement.addEventListener('error', handleError);
      videoElement.addEventListener('loadeddata', handleLoadedData);
      
      // Try to play video (browsers may block autoplay)
      const playVideo = async () => {
        try {
          if (videoElement.paused) {
            await videoElement.play();
          }
        } catch (error) {
          console.error('Autoplay prevented:', error);
        }
      };
      
      playVideo();

      return () => {
        videoElement.removeEventListener('error', handleError);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [videoSrc]);

  // Fallback background style if video fails to load
  const fallbackStyle = {
    backgroundImage: posterSrc 
      ? `url(${posterSrc})`
      : 'linear-gradient(to right, #1a1a2e, #16213e, #0f3460)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${videoLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
          {/* Fallback text is not visible to users */}
        </video>
      )}
      
      {/* Fallback Background */}
      {(videoError || videoLoading) && (
        <div 
          className="absolute inset-0 w-full h-full" 
          style={fallbackStyle}
        >
          {videoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner type="netflix" color="white" size="small" />
            </div>
          )}
        </div>
      )}
      
      {/* Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center text-white px-4 md:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl">
          {t('Experience Movies Like Never Before')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          {t('The ultimate cinema experience with the latest blockbusters and timeless classics.')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/movies"
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center transition duration-300"
          >
            <FaTicketAlt className="mr-2" />
            {t('Book Tickets')}
          </Link>
          <Link
            to="/trailers"
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center transition duration-300 backdrop-blur-sm"
          >
            <FaPlay className="mr-2" />
            {t('Watch Trailers')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 