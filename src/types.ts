export type SportType = 'soccer' | 'badminton' | 'tennis' | 'basketball' | 'pickleball' | 'volleyball' | 'golf' | 'all';
export type UserRole = 'player' | 'venue_owner' | 'staff' | 'admin';

export interface TimeSlot {
  id: string;
  court_id: string;
  venue_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: 'available' | 'booked' | 'blocked' | 'maintenance' | 'unavailable';
  time: string; // e.g. "06:00 - 07:00"
  price: number;
  isPeak: boolean;
  isBooked: boolean;
  isBlocked?: boolean;
  isMaintenance?: boolean;
}

export interface CourtSchedule {
  courtId: string;
  date: string;
  pricePerHour?: number;
  openingTime: string;
  closingTime: string;
  slotDuration: 30 | 60 | 90 | 120;
  status: 'open' | 'closed' | 'maintenance';
  slots: TimeSlot[];
}

export interface SubCourt {
  id: string;
  name: string; // Sân A, Sân B
  sport?: SportType;
  status?: 'open' | 'closed' | 'maintenance';
  pricePerHour?: number;
  description?: string;
  openingTime?: string;
  closingTime?: string;
  slotDuration?: 30 | 60 | 90 | 120;
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
  full_name?: string;
  name: string;
  avatar: string;
  phone?: string;
  role?: UserRole;
  skillLevels: { [key in SportType]: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro' };
  favoriteSports: SportType[];
  gender?: string;
  activeArea?: string;
}

export interface DemoUser {
  username: string;
  password?: string;
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
  timeSlotId: string;
  subCourtName: string;
  sport: SportType;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'pending_payment_verification' | 'confirmed' | 'cancelled' | 'payment_rejected' | 'completed';
  paymentStatus: 'pending_transfer' | 'waiting_admin_confirmation' | 'paid' | 'rejected';
  bookingGroupId?: string;
  bookingGroupTotal?: number;
  bookingCode: string;
  transferContent: string;
  createdAt: string;
  qrcode: string;
  isMatchBooking: boolean;
  participantCount: number;
  reviewPlayers: boolean;
  participants: BookingParticipant[];
}

export interface BookingParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface OwnerDashboardStats {
  totalBookings: number;
  pendingBookings: number;
  todayRevenue: number;
  monthlyRevenue: number;
  occupancyRate: number;
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
  bookingId?: string;
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
