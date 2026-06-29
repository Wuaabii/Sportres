import { Court, SportType } from '../types';
import { getFallbackImage } from '../components/SafeImage';

type VenueImageSource = Partial<Court> & {
  owner_cover_url?: string;
  image?: string;
  courtImageUrl?: string;
};

export const getVenueCardImage = (venue: VenueImageSource, fallbackSport?: SportType) =>
  venue.ownerCoverUrl
  || venue.owner_cover_url
  || venue.imageUrl
  || getFallbackImage(fallbackSport || venue.sport);
