import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'medium', 
  color = 'primary' 
}) => {
  // Determine size in pixels
  const sizeInPixels = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  }[size];

  // Determine color of the spinner
  const spinnerColor = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    white: 'border-white'
  }[color];

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeInPixels} animate-spin rounded-full border-t-2 border-b-2 ${spinnerColor}`}></div>
    </div>
  );
};

export default Spinner; 