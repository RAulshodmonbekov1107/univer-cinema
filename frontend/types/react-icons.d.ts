import { IconType } from 'react-icons';
import * as React from 'react';

declare module 'react-icons/fa' {
  export const FaChevronLeft: IconType;
  export const FaChevronRight: IconType;
  export const FaFacebook: IconType;
  export const FaInstagram: IconType;
  export const FaTwitter: IconType;
  export const FaYoutube: IconType;
  export const FaPhone: IconType;
  export const FaEnvelope: IconType;
  export const FaMapMarkerAlt: IconType;
  export const FaUser: IconType;
  export const FaSignOutAlt: IconType;
  export const FaTimes: IconType;
  export const FaBars: IconType;
  export const FaArrowRight: IconType;
}

declare module 'react-icons' {
  export interface IconType extends React.FC<{ 
    color?: string;
    size?: string | number;
    className?: string;
    style?: React.CSSProperties;
    attr?: React.SVGAttributes<SVGElement>;
  }> {}
} 