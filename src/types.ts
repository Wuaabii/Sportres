export type SportType = 'soccer' | 'badminton' | 'tennis' | 'basketball' | 'pickleball' | 'volleyball' | 'golf' | 'all';
export type UserRole = 'player' | 'venue_owner' | 'staff' | 'admin';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "06:00 - 07:00"
  price: number;
  isPeak: boolean;
  isBooked: boolean;
  isBlocked?: boolean;
}

export interface SubCourt {
  id: string;
  name: string; // Sân A, Sân B
  slots: { [date: string]: TimeSlot[] }; // Date string to list of slots
}

export interface Court {
  id: string;
  venueId?: string;
  ownerId?: string;
  name: string;
  sport: SportType;
  address: string;
  district: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  priceMin: number;
  latitude?: number;
  longitude?: number;
  description: string;
  amenities: string[];
  subCourts: SubCourt[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  skillLevels: { [key in SportType]: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro' };
  walletBalance: number;
  points: number;
  tier: 'Đồng' | 'Bạc' | 'Vàng' | 'Kim cương';
  favoriteSports: SportType[];
  gender?: string;
  activeArea?: string;
}

export interface DemoUser {
  username: string;
  password: string;
  role: UserRole;
  profile: UserProfile;
}

export interface Booking {
  id: string;
  courtId: string;
  venueId?: string;
  ownerId?: string;
  courtName: string;
  subCourtId: string;
  subCourtName: string;
  sport: SportType;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  createdAt: string;
  qrcode: string;
}

export interface MatchPlayer {
  id: string;
  name: string;
  avatar: string;
  skill: string;
  sport?: SportType;
  status?: 'joined' | 'left' | 'pending';
  joinedAt?: string;
}

export interface Match {
  id: string;
  title: string;
  sport: SportType;
  courtId: string;
  courtName: string;
  address: string;
  date: string;
  time: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  players: MatchPlayer[];
  maxPlayers: number;
  pricePerPlayer: number;
  status: 'open' | 'full' | 'finished';
  description: string;
}

export interface Tournament {
  id: string;
  title: string;
  sport: SportType;
  status: 'upcoming' | 'ongoing' | 'finished';
  date: string;
  venue: string;
  participantsLimit: number;
  registeredCount: number;
  prizePool: string;
  imageUrl: string;
  bracket?: {
    quarterFinals: { team1: string; team2: string; score1?: number; score2?: number; winner?: string }[];
    semiFinals: { team1: string; team2: string; score1?: number; score2?: number; winner?: string }[];
    finals: { team1: string; team2: string; score1?: number; score2?: number; winner?: string }[];
  };
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  sport: SportType;
  winRate: string;
  matchesPlayed: number;
  tier: string;
  avatar: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'booking_payment' | 'booking_refund' | 'match_payment' | 'match_refund' | 'reward';
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  venueId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FriendItem {
  id: string;
  name: string;
  avatar: string;
  favoriteSport: string;
  status: 'online' | 'busy' | 'offline';
  statusText: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface PrivateChat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  sport: string;
  history: ChatMessage[];
}

export interface FriendRequest {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
  };
  toUser: {
    id: string;
    name: string;
    avatar: string;
  };
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  message: string;
}

export interface Notification {
  id: string;
  type: 'booking' | 'match' | 'tournament' | 'message' | 'system' | 'promotion';
  recipientUserId?: string;
  venueId?: string;
  ownerId?: string;
  referenceId?: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface VenueRequest {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  name: string;
  address: string;
  district: string;
  sport: SportType;
  pricePerHour: number;
  openingHour: string;
  closingHour: string;
  closedDays: string;
  description?: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}
