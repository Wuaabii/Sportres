import React, { useEffect, useState } from 'react';
import { SportType } from '../types';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  defaultSrc?: string;
  sportType?: SportType;
}

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800';
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';
const FALLBACK_IMAGES: Record<SportType, string> = {
  soccer: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
  badminton: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
  tennis: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
  basketball: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
  pickleball: 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
  volleyball: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800',
  golf: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=800',
  all: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export const getFallbackImage = (sportType?: SportType) => {
  return sportType ? FALLBACK_IMAGES[sportType] : DEFAULT_IMAGE;
};

export const SafeImage: React.FC<SafeImageProps> = ({ src, fallbackSrc, defaultSrc, sportType, alt, onError, ...props }) => {
  const fallbackBySport = getFallbackImage(sportType);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc || defaultSrc || fallbackBySport);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc || defaultSrc || fallbackBySport);
  }, [src, fallbackSrc, defaultSrc, fallbackBySport]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const candidates = [fallbackSrc, defaultSrc, fallbackBySport, DEFAULT_IMAGE].filter(Boolean) as string[];
    const nextSrc = candidates.find(candidate => candidate !== currentSrc);
    if (!nextSrc) return;
    setCurrentSrc(nextSrc);
    if (onError) onError(event);
  };

  return (
    <img
      src={currentSrc}
      alt={alt || ''}
      onError={handleError}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
