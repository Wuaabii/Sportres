import React, { createContext, useContext, useState, useEffect } from 'react';
import { Court, CourtSchedule, Booking, Match, UserProfile, Tournament, SportType, TimeSlot, SubCourt, DemoUser, UserRole, FriendItem, PrivateChat, FriendRequest, Notification, VenueRequest, OwnerDashboardStats, AdminRevenueAnalytics } from '../types';
import { getVenueCardImage } from '../utils/venueImages';

export type CreateVenueOwnerPayload = {
  fullName: string;
  phone: string;
  temporaryPassword: string;
  venueName: string;
  address: string;
  district: string;
  sport: Exclude<SportType, 'all'>;
};

interface SportContextType {
  user: UserProfile;
  courts: Court[];
  bookings: Booking[];
  ownerDashboardStats: OwnerDashboardStats;
  adminRevenueAnalytics: AdminRevenueAnalytics;
  matches: Match[];
  tournaments: Tournament[];
  notifications: Notification[];
  venueRequests: VenueRequest[];
  demoUsers: DemoUser[];
  friends: FriendItem[];
  privateChats: PrivateChat[];
  friendRequests: FriendRequest[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  loadTimeSlots: (courtId: string, date: string) => Promise<void>;
  loadOwnerSchedule: (venueId: string, courtId: string, date: string) => Promise<CourtSchedule>;
  saveOwnerSchedule: (venueId: string, schedule: CourtSchedule, generate?: boolean) => Promise<CourtSchedule>;
  updateOwnerSlotStatus: (venueId: string, courtId: string, date: string, slotId: string, status: 'available' | 'locked' | 'maintenance') => Promise<void>;
  createOwnerCourt: (payload: {
    venueId: string;
    name: string;
    address?: string;
    sport: Exclude<SportType, 'all'>;
    pricePerHour: number;
    status: 'open' | 'closed' | 'maintenance';
    description?: string;
  }) => Promise<void>;
  updateOwnerCourt: (courtId: string, payload: {
    name: string;
    address?: string;
    sport: Exclude<SportType, 'all'>;
    pricePerHour: number;
    status: 'open' | 'closed' | 'maintenance';
    description?: string;
  }) => Promise<void>;
  deleteOwnerCourt: (courtId: string) => Promise<void>;
  createBookings: (
    selectedSlots: TimeSlot[],
    date: string,
    customExtras: { rackets: number; water: number },
  ) => Promise<{ success: boolean; error?: string; bookings?: Booking[] }>;
  confirmBookingTransfer: (bookingId: string) => Promise<void>;
  approveBookingPayment: (bookingId: string) => Promise<void>;
  rejectBookingPayment: (bookingId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => void;
  refreshOwnerDashboardStats: () => Promise<void>;
  refreshAdminRevenueAnalytics: () => Promise<void>;
  updateSlotAvailability: (courtId: string, subCourtId: string, date: string, slotId: string, available: boolean) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  submitVenueRequest: (request: Omit<VenueRequest, 'id' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'status' | 'createdAt' | 'reviewedAt' | 'rejectionReason'>) => VenueRequest;
  approveVenueRequest: (requestId: string) => void;
  rejectVenueRequestSubmission: (requestId: string, reason?: string) => void;
  joinMatchID: (matchId: string) => { success: boolean; error?: string };
  leaveMatchID: (matchId: string) => void;
  createMatch: (matchData: Omit<Match, 'id' | 'players' | 'status' | 'creatorId' | 'creatorName' | 'creatorAvatar'>) => Match;
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  refreshAllData: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<UserProfile>;
  changePassword: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<string>;
  uploadUserAvatar: (file: File) => Promise<UserProfile>;
  uploadOwnerCoverImage: (file: File) => Promise<string>;
  uploadOwnerCourtImage: (courtId: string, file: File) => Promise<string>;
  loginUser: (phone: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  registerUser: (payload: { fullName: string; phone: string; password: string }) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  createVenueOwner: (payload: CreateVenueOwnerPayload) => Promise<{
    success: boolean;
    error?: string;
    owner?: DemoUser;
    venue?: { id: string; ownerId: string; name: string; address: string; district: string; status: string; sport: SportType };
  }>;
  logoutUser: () => void;
  completeBooking: (bookingId: string) => void;
  selectedCourtId: string | null;
  setSelectedCourtId: (id: string | null) => void;
  selectedMatchId: string | null;
  setSelectedMatchId: (id: string | null) => void;
  sendFriendRequest: (player: { id: string; name: string; avatar: string }) => void;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  startPrivateChatWith: (participant: { id: string; name: string; avatar: string; favoriteSport?: string; status?: FriendItem['status']; statusText?: string }) => PrivateChat;
  sendPrivateMessage: (chatId: string, text: string) => void;
  removeFriend: (friendId: string) => void;
}

const SportContext = createContext<SportContextType | undefined>(undefined);

const API_BASE = '';
const AUTH_TOKEN_KEY = 'sportres_auth_token';

const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

const isBinaryBody = (body: BodyInit | null | undefined) =>
  typeof FormData !== 'undefined' && body instanceof FormData
  || typeof Blob !== 'undefined' && body instanceof Blob
  || typeof ArrayBuffer !== 'undefined' && body instanceof ArrayBuffer;

const apiRequest = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
  const token = getAuthToken();
  const endpoint = `${API_BASE}${path}`;
  const requiresAuth = path.startsWith('/api/owner/') || path.startsWith('/api/admin/') || path.startsWith('/api/me') || path.startsWith('/api/profile') || path.startsWith('/api/bookings') || path.startsWith('/api/notifications');
  if (requiresAuth && !token) {
    console.error('[SportRes API]', { endpoint, status: 401, response: 'Missing authentication token' });
    throw new Error('Vui lòng đăng nhập lại.');
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        ...(!isBinaryBody(options.body) ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
    const rawBody = await response.text();
    let data: any = {};
    let parsedJson = true;
    try {
      data = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      parsedJson = false;
      data = { error: rawBody || `HTTP ${response.status}` };
    }
    if (!parsedJson) {
      console.error('[SportRes API]', { endpoint, status: response.status, response: rawBody });
      throw new Error(`Phản hồi API không hợp lệ tại ${path}. Vui lòng khởi động lại máy chủ SportRes.`);
    }
    if (!response.ok) {
      console.error('[SportRes API]', { endpoint, status: response.status, response: data });
      if (response.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        throw new Error('Vui lòng đăng nhập lại.');
      }
      throw new Error(data.error || `Máy chủ trả về lỗi HTTP ${response.status}.`);
    }
    return data as T;
  } catch (error: any) {
    if (error instanceof Error && (
      error.message === 'Vui lòng đăng nhập lại.' ||
      error.message.startsWith('Máy chủ trả về lỗi') ||
      error.message !== 'Failed to fetch'
    )) {
      throw error;
    }
    console.error('[SportRes API]', { endpoint, status: 0, response: error?.message || error });
    throw new Error('Không thể kết nối máy chủ SportRes.');
  }
};

const normalizeTimeSlot = (rawSlot: any, fallbackPrice = 0): TimeSlot => {
  const id = String(rawSlot.id || rawSlot.time_slot_id || '');
  const startTime = String(rawSlot.start_time || rawSlot.time?.split(' - ')[0] || '').slice(0, 5);
  const endTime = String(rawSlot.end_time || rawSlot.time?.split(' - ')[1] || '').slice(0, 5);
  const status: TimeSlot['status'] = rawSlot.status
    || (rawSlot.isMaintenance ? 'maintenance'
      : rawSlot.isBooked ? 'booked'
        : rawSlot.isBlocked ? 'blocked'
          : id ? 'available' : 'unavailable');
  return {
    ...rawSlot,
    id,
    court_id: String(rawSlot.court_id || rawSlot.courtId || ''),
    venue_id: String(rawSlot.venue_id || rawSlot.venueId || ''),
    date: String(rawSlot.date || ''),
    start_time: startTime,
    end_time: endTime,
    status,
    time: rawSlot.time || `${startTime} - ${endTime}`,
    price: Number(rawSlot.price) > 0 ? Number(rawSlot.price) : Math.max(0, Number(fallbackPrice || 0)),
    isPeak: Boolean(rawSlot.isPeak ?? rawSlot.is_peak),
    isBooked: status === 'booked',
    isBlocked: status === 'blocked',
    isMaintenance: status === 'maintenance',
  };
};

// Helper to generate dynamic dates
const getOffsetDateString = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const DATES_POOL = Array.from({ length: 14 }, (_, index) => getOffsetDateString(index));

const PROFILE_SPORTS: SportType[] = ['soccer', 'badminton', 'tennis', 'pickleball', 'basketball', 'volleyball', 'golf'];
const DEFAULT_SKILL_LEVELS: UserProfile['skillLevels'] = {
  soccer: 'Beginner',
  badminton: 'Beginner',
  tennis: 'Beginner',
  basketball: 'Beginner',
  pickleball: 'Beginner',
  volleyball: 'Beginner',
  golf: 'Beginner',
  all: 'Beginner',
};

const normalizeUserProfile = (profile: UserProfile): UserProfile => {
  const favoriteSports = PROFILE_SPORTS.filter(sport => profile.favoriteSports?.includes(sport));
  const normalizedRole = (profile.role as string) === 'owner' ? 'venue_owner' : profile.role;
  return {
    ...profile,
    role: normalizedRole,
    full_name: profile.full_name || profile.name,
    name: profile.full_name || profile.name,
    avatar: profile.avatar || '/sportres-logo.png',
    favoriteSports,
    skillLevels: {
      ...DEFAULT_SKILL_LEVELS,
      ...(profile.skillLevels || {}),
    },
  };
};

const COURT_OWNERSHIP: Record<string, { venueId: string; ownerId: string }> = {
  'court-1': { venueId: 'venue-grasslands-svh', ownerId: 'user-owner1' },
  'court-2': { venueId: 'venue-hung-vuong', ownerId: 'user-owner2' },
  'court-3': { venueId: 'venue-lan-anh', ownerId: 'user-owner1' },
  'court-4': { venueId: 'venue-phu-tho', ownerId: 'user-owner1' },
  'court-5': { venueId: 'venue-court-5', ownerId: 'user-owner1' },
  'court-6': { venueId: 'venue-court-6', ownerId: 'user-owner2' },
  'court-7': { venueId: 'venue-court-7', ownerId: 'user-owner1' },
  'court-8': { venueId: 'venue-court-8', ownerId: 'user-owner1' },
  'court-9': { venueId: 'venue-court-9', ownerId: 'user-owner2' },
  'court-10': { venueId: 'venue-court-10', ownerId: 'user-owner1' },
  'court-11': { venueId: 'venue-court-11', ownerId: 'user-owner1' },
  'court-12': { venueId: 'venue-court-12', ownerId: 'user-owner1' },
  'court-13': { venueId: 'venue-court-13', ownerId: 'user-owner1' },
  'court-14': { venueId: 'venue-court-14', ownerId: 'user-owner1' },
  'court-15': { venueId: 'venue-court-15', ownerId: 'user-owner2' },
  'court-16': { venueId: 'venue-court-16', ownerId: 'user-owner1' },
  'court-17': { venueId: 'venue-court-17', ownerId: 'user-owner1' },
  'court-18': { venueId: 'venue-court-18', ownerId: 'user-owner1' },
  'court-19': { venueId: 'venue-court-19', ownerId: 'user-owner2' },
  'court-20': { venueId: 'venue-court-20', ownerId: 'user-owner1' },
  'court-21': { venueId: 'venue-court-21', ownerId: 'user-owner1' },
  'court-22': { venueId: 'venue-court-22', ownerId: 'user-owner2' },
  'court-23': { venueId: 'venue-court-23', ownerId: 'user-owner1' },
  'court-24': { venueId: 'venue-court-24', ownerId: 'user-owner1' },
  'court-25': { venueId: 'venue-court-25', ownerId: 'user-owner1' },
  'court-26': { venueId: 'venue-court-26', ownerId: 'user-owner1' },
  'court-27': { venueId: 'venue-court-27', ownerId: 'user-owner2' },
  'court-28': { venueId: 'venue-court-28', ownerId: 'user-owner1' },
  'court-29': { venueId: 'venue-court-29', ownerId: 'user-owner1' },
  'court-30': { venueId: 'venue-court-30', ownerId: 'user-owner1' },
  'court-31': { venueId: 'venue-court-31', ownerId: 'user-owner1' },
  'court-32': { venueId: 'venue-court-32', ownerId: 'user-owner1' },
  'court-33': { venueId: 'venue-court-33', ownerId: 'user-owner2' },
};

const COURT_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  'court-1': { latitude: 21.0142, longitude: 105.5258 },
  'court-2': { latitude: 21.0119, longitude: 105.5310 },
  'court-3': { latitude: 21.0150, longitude: 105.5210 },
  'court-4': { latitude: 21.0131, longitude: 105.5268 },
  'court-5': { latitude: 21.0095, longitude: 105.5285 },
  'court-6': { latitude: 21.0068, longitude: 105.5220 },
  'court-7': { latitude: 20.9990, longitude: 105.5390 },
  'court-8': { latitude: 20.9920, longitude: 105.5320 },
  'court-9': { latitude: 21.0260, longitude: 105.5290 },
  'court-10': { latitude: 21.0155, longitude: 105.5245 },
  'court-11': { latitude: 21.0182, longitude: 105.5190 },
  'court-12': { latitude: 21.0220, longitude: 105.5230 },
  'court-13': { latitude: 21.0205, longitude: 105.5305 },
  'court-14': { latitude: 21.0088, longitude: 105.5252 },
  'court-15': { latitude: 21.0072, longitude: 105.5208 },
  'court-16': { latitude: 21.0037, longitude: 105.5296 },
  'court-17': { latitude: 21.0061, longitude: 105.5189 },
  'court-18': { latitude: 21.0102, longitude: 105.5277 },
  'court-19': { latitude: 21.0049, longitude: 105.5317 },
  'court-20': { latitude: 21.0017, longitude: 105.5362 },
  'court-21': { latitude: 21.0081, longitude: 105.5246 },
  'court-22': { latitude: 21.0282, longitude: 105.5301 },
  'court-23': { latitude: 21.0108, longitude: 105.5266 },
  'court-24': { latitude: 21.0147, longitude: 105.5229 },
  'court-25': { latitude: 21.0058, longitude: 105.5334 },
  'court-26': { latitude: 21.0136, longitude: 105.5203 },
  'court-27': { latitude: 21.0186, longitude: 105.5168 },
  'court-28': { latitude: 21.0128, longitude: 105.5194 },
  'court-29': { latitude: 21.0033, longitude: 105.5424 },
  'court-30': { latitude: 21.0164, longitude: 105.5273 },
  'court-31': { latitude: 21.0198, longitude: 105.5252 },
  'court-32': { latitude: 21.0091, longitude: 105.5178 },
  'court-33': { latitude: 21.0116, longitude: 105.5235 },
};

const SPORT_IMAGE_FALLBACKS: Record<SportType, string> = {
  soccer: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
  badminton: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
  tennis: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
  basketball: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
  pickleball: 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
  volleyball: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800',
  golf: 'https://images.pexels.com/photos/1325735/pexels-photo-1325735.jpeg?auto=compress&cs=tinysrgb&w=800',
  all: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const getNormalizedCourtImage = (court: Court) => {
  const imageUrl = getVenueCardImage(court);
  if (imageUrl.includes('photo-1495567744504') || imageUrl.includes('photo-1508098682722')) {
    return SPORT_IMAGE_FALLBACKS.soccer;
  }
  if (imageUrl.includes('photo-1508896694512') || imageUrl.includes('photo-1599447421415')) {
    return SPORT_IMAGE_FALLBACKS.tennis;
  }
  if (imageUrl.includes('photo-1521537634199') || imageUrl.includes('photo-1561310648')) {
    return SPORT_IMAGE_FALLBACKS.badminton;
  }
  if (imageUrl.includes('photo-1551022370')) {
    return SPORT_IMAGE_FALLBACKS.basketball;
  }
  if (imageUrl.includes('photo-1605353552984')) {
    return SPORT_IMAGE_FALLBACKS.pickleball;
  }
  if (imageUrl.includes('photo-1526232761687')) {
    return SPORT_IMAGE_FALLBACKS.all;
  }
  return imageUrl || SPORT_IMAGE_FALLBACKS[court.sport];
};

const withCourtOwnership = (court: Court): Court => {
  const fallbackOwner = 'user-owner1';
  const ownership = COURT_OWNERSHIP[court.id] || {
    venueId: `venue-${court.id}`,
    ownerId: fallbackOwner,
  };
  return {
    ...court,
    imageUrl: getNormalizedCourtImage(court),
    latitude: court.latitude ?? COURT_COORDINATES[court.id]?.latitude,
    longitude: court.longitude ?? COURT_COORDINATES[court.id]?.longitude,
    venueId: COURT_OWNERSHIP[court.id]?.venueId || court.venueId || ownership.venueId,
    ownerId: COURT_OWNERSHIP[court.id]?.ownerId || court.ownerId || ownership.ownerId,
  };
};

const buildCourtFromVenueRequest = (request: VenueRequest): Court => {
  const subCourtId = `sub-${request.id}`;
  const slotsMap: { [date: string]: TimeSlot[] } = {};
  DATES_POOL.forEach(date => {
    const generated = generateSlotsForDay(request.sport).map(slot => ({
      ...slot,
      price: request.pricePerHour,
      isPeak: false,
      isBooked: false,
    }));
    slotsMap[date] = generated;
  });

  return withCourtOwnership({
    id: `court-${request.id}`,
    venueId: `venue-${request.id}`,
    ownerId: request.ownerId,
    name: request.name,
    sport: request.sport,
    address: request.address,
    district: request.district,
    rating: 0,
    reviewsCount: 0,
    imageUrl: request.imageUrl || SPORT_IMAGE_FALLBACKS[request.sport],
    priceMin: request.pricePerHour,
    latitude: undefined,
    longitude: undefined,
    description: request.description || 'Sân mới đang chờ phát sinh đánh giá từ khách hàng.',
    amenities: [`Mở cửa: ${request.openingHour} - ${request.closingHour}`, `Ngày nghỉ: ${request.closedDays}`],
    subCourts: [
      {
        id: subCourtId,
        name: request.name,
        slots: slotsMap,
      },
    ],
  });
};

// Helper to generate standard slots
const generateSlotsForDay = (sport: SportType): TimeSlot[] => {
  return Array.from({ length: 16 }, (_, index) => {
    const hour = index + 6;
    const peak = hour >= 16 && hour <= 20;
    const basePrice = sport === 'badminton' ? 70000 : sport === 'soccer' ? 250000 : sport === 'tennis' ? 150000 : 180000;
    const peakPrice = sport === 'badminton' ? 120000 : sport === 'soccer' ? 500000 : sport === 'tennis' ? 260000 : 320000;
    const startTime = `${String(hour).padStart(2, '0')}:00`;
    const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
    return {
      id: '',
      court_id: '',
      venue_id: '',
      date: '',
      start_time: startTime,
      end_time: endTime,
      status: 'unavailable',
      time: `${startTime} - ${endTime}`,
      price: peak ? peakPrice : basePrice,
      isPeak: peak,
      isBooked: false,
      isBlocked: false,
    };
  });
};

const INITIAL_COURTS_DATA: Court[] = [
  {
    id: 'court-1',
    name: 'Sân bóng Grasslands Sư Vạn Hạnh',
    sport: 'soccer',
    address: '824 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh',
    district: 'Quận 10',
    rating: 4.8,
    reviewsCount: 142,
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 250000,
    description: 'Sân cỏ nhân tạo chất lượng cao chuẩn FIFA, hệ thống chiếu sáng LED hiện đại xuyên đêm. Có căn-tin phục vụ nước uống và dịch vụ cho mượn bib miễn phí.',
    amenities: ['Trực tiếp bóng đá', 'Bãi xe ô tô', 'Căn tin nước', 'Tắm vòi sen', 'Băng vết thương miễn phí'],
    subCourts: [
      { id: 'sub-c1-1', name: 'Sân 1 (Sân 5 người)', slots: {} },
      { id: 'sub-c1-2', name: 'Sân 2 (Sân 7 người)', slots: {} },
    ]
  },
  {
    id: 'court-2',
    name: 'CLB Cầu lông Hùng Vương Plaza',
    sport: 'badminton',
    address: '126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh',
    district: 'Quận 5',
    rating: 4.6,
    reviewsCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    priceMin: 70000,
    description: 'Thảm cầu lông Yonex nhập khẩu cực êm chân, trần cao không bị chói đèn. Có ban huấn luyện chỉ dạy và tổ đóng cặp năng động.',
    amenities: ['Thuê vợt Yonex', 'Phòng máy lạnh nghỉ ngơi', 'Wifi miễn phí', 'Tủ đồ an toàn', 'Cửa hàng dụng cụ'],
    subCourts: [
      { id: 'sub-c2-1', name: 'Sân số 1 (Premium)', slots: {} },
      { id: 'sub-c2-2', name: 'Sân số 2', slots: {} },
      { id: 'sub-c2-3', name: 'Sân số 3', slots: {} },
    ]
  },
  {
    id: 'court-3',
    name: 'Sân Tennis Lan Anh Club',
    sport: 'tennis',
    address: '291 Cách Mạng Tháng 8, Phường 12, Quận 10, TP. Hồ Chí Minh',
    district: 'Quận 10',
    rating: 4.9,
    reviewsCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    priceMin: 150000,
    description: 'Cum sân quần vợt đẳng cấp chuyên nghiệp nhất thành phố, từng tổ chức nhiều giải cấp quốc gia. Mặt sân đất nung tiêu chuẩn quốc tế.',
    amenities: ['Huấn luyện viên', 'Nhà hàng ẩm thực', 'Hồ bơi thư giãn', 'Phòng tắm hơi', 'Cho thuê máy giao bóng'],
    subCourts: [
      { id: 'sub-c3-1', name: 'Sân Trung tâm (Khán đài)', slots: {} },
      { id: 'sub-c3-2', name: 'Sân số 2 Bán nguyệt', slots: {} },
    ]
  },
  {
    id: 'court-4',
    name: 'Khu thể thao rổ Phú Thọ',
    sport: 'basketball',
    address: '221 Lý Thường Kiệt, Phường 15, Quận 11, TP. Hồ Chí Minh',
    district: 'Quận 11',
    rating: 4.5,
    reviewsCount: 76,
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
    priceMin: 180000,
    description: 'Sân bóng rổ trong nhà chất liệu sàn gỗ cao cấp chống trơn trượt và sân ngoài trời thoáng đãng. Hệ thống rổ kéo điều chỉnh độ cao linh hoạt.',
    amenities: ['Bóng Spalding chuẩn', 'Khu tắm rửa', 'Đồng hồ đếm giây điện tử', 'Xà đu thể lực', 'Ghế khán giả rộng rãi'],
    subCourts: [
      { id: 'sub-c4-1', name: 'Sân Gỗ Trực Diện (Trong Nhà)', slots: {} },
      { id: 'sub-c4-2', name: 'Sân Nhựa Tổng Hợp (Ngoài Trời)', slots: {} },
    ]
  },
  {
    id: 'court-5',
    name: 'Sân bóng Grasslands Bình Yên',
    sport: 'soccer',
    address: 'Đường tỉnh 420, Xã Bình Yên, Thạch Thất, Hà Nội',
    district: 'Xã Bình Yên',
    rating: 4.7,
    reviewsCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    priceMin: 280000,
    description: 'Sân bóng Grasslands Bình Yên có cụm sân cỏ chuẩn 7 người và 5 người rộng rãi thoáng mát, cơ sở vật chất đảm bảo tiêu chí thi đấu phong trào tốt nhất.',
    amenities: ['Wifi miễn phí', 'Tắm vòi sen', 'Căn tin phục vụ nước uống'],
    subCourts: [
      { id: 'sub-c5-1', name: 'Sân Bóng số 1 (7 người)', slots: {} },
      { id: 'sub-c5-2', name: 'Sân Bóng số 2 (5 người)', slots: {} }
    ]
  },
  {
    id: 'court-6',
    name: 'Nhà Thi Đấu Thể Thao Hòa Lạc',
    sport: 'badminton',
    address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.9,
    reviewsCount: 156,
    imageUrl: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 95000,
    description: 'Sân cầu lông thảm đỉnh cao chuyên phục vụ cán bộ tập đoàn và cư dân Hòa Lạc. Trần cao thoáng, đèn LED chống chói mắt.',
    amenities: ['Thuê vợt Yonex', 'Phòng máy lạnh', 'Gửi xe ô tô', 'Nước uống sạch'],
    subCourts: [
      { id: 'sub-c6-1', name: 'Sân Thảm Cao Cấp 1', slots: {} },
      { id: 'sub-c6-2', name: 'Sân Thảm Cao Cấp 2', slots: {} }
    ]
  },
  {
    id: 'court-7',
    name: 'Sân Quần Vợt Liên Quan',
    sport: 'tennis',
    address: 'Thị trấn Liên Quan, Thạch Thất, Hà Nội',
    district: 'Liên Quan',
    rating: 4.4,
    reviewsCount: 30,
    imageUrl: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 140000,
    description: 'Sân tennis ngoài trời chuẩn kích thước Liên đoàn, nằm cạnh trung tâm giải trí huyện Thạch Thất. Đầy đủ lưới chắn gió.',
    amenities: ['Đèn cao áp đêm', 'Cho mượn bóng', 'Chỗ nghỉ có mái che'],
    subCourts: [
      { id: 'sub-c7-1', name: 'Sân Đất Cứng số 1', slots: {} }
    ]
  },
  {
    id: 'court-8',
    name: 'Sân bóng SunSport Bình Yên',
    sport: 'soccer',
    address: 'Xã Bình Yên, Thạch Thất, Hà Nội',
    district: 'Xã Bình Yên',
    rating: 4.6,
    reviewsCount: 65,
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
    priceMin: 220000,
    description: 'Mặt cỏ nhân tạo êm chân, có dịch vụ quay video trận đấu bằng flycam, cho mượn áo đấu bib và hỗ trợ trọng tài cho các đội bóng phủi.',
    amenities: ['Dịch vụ quay phim', 'Áo tập bib free', 'Nước trà chanh giải khát'],
    subCourts: [
      { id: 'sub-c8-1', name: 'Sân Sun-A (5 người)', slots: {} }
    ]
  },
  {
    id: 'court-9',
    name: 'CLB Cầu lông Sun-Light Phùng Xá',
    sport: 'badminton',
    address: 'Xã Phùng Xá, Thạch Thất, Hà Nội',
    district: 'Phùng Xá',
    rating: 4.7,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    priceMin: 85000,
    description: 'Không gian tập luyện cầu lông năng động, câu lạc bộ tại Phùng Xá chuyên kết nối các cặp đấu đôi kịch tính, giao hữu thường niên.',
    amenities: ['Hỗ trợ ghép cặp', 'Mua bán phụ kiện', 'Giữ xe có thẻ từ'],
    subCourts: [
      { id: 'sub-c9-1', name: 'Thảm Gỗ Sun Light 1', slots: {} }
    ]
  },
  {
    id: 'court-10',
    name: 'Sân Pickleball Tech-Hub Hòa Lạc',
    sport: 'pickleball',
    address: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.8,
    reviewsCount: 42,
    imageUrl: 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 120000,
    description: 'Sân chơi trào lưu pickleball thời thượng nhất Thạch Thất, đầy đủ vợt chuẩn Mỹ, thảm bóng nhám đỉnh cao.',
    amenities: ['Cho thuê vợt cao cấp', 'Wifi tốc độ cao', 'Căn tin sinh tố'],
    subCourts: [
      { id: 'sub-c10-1', name: 'Sân Pickleball số 1', slots: {} }
    ]
  },
  {
    id: 'court-11',
    name: 'Sân Bóng Chuyền Hữu Nghị Liên Quan',
    sport: 'volleyball',
    address: 'Thị trấn Liên Quan, Thạch Thất, Hà Nội',
    district: 'Liên Quan',
    rating: 4.5,
    reviewsCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800',
    priceMin: 100000,
    description: 'Bề mặt phủ sơn cao cấp chống loá, lưới căng chuẩn Việt Nam, thắp sáng cả tối muộn, giao lưu sôi nổi.',
    amenities: ['Đèn cao áp 24/7', 'Cho thuê bóng chuyền da', 'Khu tắm rửa sạch'],
    subCourts: [
      { id: 'sub-c11-1', name: 'Sân bóng chuyền chính', slots: {} }
    ]
  },
  {
    id: 'court-12',
    name: 'Tổ hợp Golf 3D & Mini Green Bình Yên',
    sport: 'golf',
    address: 'Xã Bình Yên, Thạch Thất, Hà Nội',
    district: 'Xã Bình Yên',
    rating: 4.9,
    reviewsCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800',
    priceMin: 350000,
    description: 'Phòng tập golf 3D giả lập hiện đại chuẩn Hàn Quốc cùng sân gạt mini ngoài trời ngập tràn cỏ xanh.',
    amenities: ['Phần mềm phân tích Swing', 'Cho mượn gậy Callaway', 'Trà chiều thượng hạng'],
    subCourts: [
      { id: 'sub-c12-1', name: 'Phòng máy Golf 3D 1', slots: {} }
    ]
  },
  {
    id: 'court-13',
    name: 'Sân Thể Thao Đa Năng Bình Yên',
    sport: 'all',
    address: 'Sân văn hóa thể thao Xã Bình Yên, Thạch Thất, Hà Nội',
    district: 'Xã Bình Yên',
    rating: 4.6,
    reviewsCount: 40,
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 90000,
    description: 'Sân chơi đa năng tích hợp bóng rổ, bóng chuyền, và cầu lông, phù hợp với mọi lứa tuổi và hoạt động thể thao tự do.',
    amenities: ['Ánh sáng tối tốt', 'Chỗ gửi xe rộng rãi', 'Tiện ích công cộng'],
    subCourts: [
      { id: 'sub-c13-1', name: 'Sân đa năng Thạch Thất 1', slots: {} }
    ]
  },
  {
    id: 'court-14',
    name: 'Sân bóng Đại Nam Mở Rộng',
    sport: 'soccer',
    address: 'Thạch Thất, Hà Nội',
    district: 'Thạch Thất',
    rating: 4.5,
    reviewsCount: 10,
    imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
    priceMin: 200000,
    description: 'Bổ sung sân mới, mặt cỏ êm, đèn chiếu sáng cực mạnh.',
    amenities: ['Đèn LED xịn', 'Phòng thay đồ'],
    subCourts: [{ id: 'sub-c14-1', name: 'Sân Đại Nam 3', slots: {} }]
  },
  {
    id: 'court-15',
    name: 'Sân Cầu Lông Tân Phú Arena',
    sport: 'badminton',
    address: 'Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.7,
    reviewsCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    priceMin: 80000,
    description: 'Sân chuyên nghiệp, sạch sẽ, thoáng mát.',
    amenities: ['Thảm xịn', 'Máy lọc nước'],
    subCourts: [{ id: 'sub-c15-1', name: 'Sân A1', slots: {} }]
  },
  {
    id: 'court-16',
    name: 'Sân Tennis Hiện Đại',
    sport: 'tennis',
    address: 'Bình Yên, Thạch Thất, Hà Nội',
    district: 'Bình Yên',
    rating: 4.8,
    reviewsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    priceMin: 200000,
    description: 'Sân tennis hiện đại, chuẩn thi đấu.',
    amenities: ['Ánh sáng đầy đủ', 'Cho thuê vợt'],
    subCourts: [{ id: 'sub-c16-1', name: 'Sân B1', slots: {} }]
  },
  {
    id: 'court-17',
    name: 'Sân Bóng Rổ Bách Khoa Mở Rộng',
    sport: 'basketball',
    address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.4,
    reviewsCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=800',
    priceMin: 150000,
    description: 'Sân bóng rổ ngoài trời không gian mở.',
    amenities: ['Giá đỡ bóng xịn', 'Ghế uống nước'],
    subCourts: [{ id: 'sub-c17-1', name: 'Sân Rổ A', slots: {} }]
  },
  {
    id: 'court-18',
    name: 'Sân Bóng Grasslands Mở Rộng',
    sport: 'soccer',
    address: 'Thạch Thất, Hà Nội',
    district: 'Thạch Thất',
    rating: 4.6,
    reviewsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    priceMin: 220000,
    description: 'Sân cỏ đẹp, phục vụ anh em đam mê.',
    amenities: ['Wifi', 'Căn tin'],
    subCourts: [{ id: 'sub-c18-1', name: 'Sân Grasslands 3', slots: {} }]
  },
  {
    id: 'court-19',
    name: 'CLB Cầu Lông Bình Yên Top',
    sport: 'badminton',
    address: 'Bình Yên, Thạch Thất, Hà Nội',
    district: 'Bình Yên',
    rating: 4.8,
    reviewsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    priceMin: 90000,
    description: 'Sân cầu lông chất lượng đỉnh cao.',
    amenities: ['Đèn tốt', 'Quạt trần'],
    subCourts: [{ id: 'sub-c19-1', name: 'Sân Cầu 1', slots: {} }]
  },
  {
    id: 'court-20',
    name: 'Sân Quần Vợt Hoa Sen',
    sport: 'tennis',
    address: 'Thạch Thất, Hà Nội',
    district: 'Thạch Thất',
    rating: 4.3,
    reviewsCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=800',
    priceMin: 160000,
    description: 'Sân tennis sạch sẽ, không gian yên tĩnh.',
    amenities: ['Máy giao bóng', 'Nhà vệ sinh sạch'],
    subCourts: [{ id: 'sub-c20-1', name: 'Sân Tennis 3', slots: {} }]
  },
  {
    id: 'court-21',
    name: 'Sân Bóng Thạch Thất 2',
    sport: 'soccer',
    address: 'Thạch Thất, Hà Nội',
    district: 'Thạch Thất',
    rating: 4.5,
    reviewsCount: 12,
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 180000,
    description: 'Sân bóng mới hoàn thiện, cỏ xanh mướt.',
    amenities: ['Đèn LED', 'Wifi'],
    subCourts: [{ id: 'sub-c21-1', name: 'Sân Bóng 2', slots: {} }]
  },
  {
    id: 'court-22',
    name: 'CLB Cầu Lông Phùng Xá Mới',
    sport: 'badminton',
    address: 'Phùng Xá, Thạch Thất, Hà Nội',
    district: 'Phùng Xá',
    rating: 4.4,
    reviewsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
    priceMin: 75000,
    description: 'Câu lạc bộ cầu lông giao lưu phong trào.',
    amenities: ['Căng tin', 'Giữ xe'],
    subCourts: [{ id: 'sub-c22-1', name: 'Sân Cầu 2', slots: {} }]
  },
  {
    id: 'court-23',
    name: 'Sân Pickleball Sun Sport',
    sport: 'pickleball',
    address: 'Bình Yên, Thạch Thất, Hà Nội',
    district: 'Bình Yên',
    rating: 4.9,
    reviewsCount: 21,
    imageUrl: 'https://images.pexels.com/photos/15390858/pexels-photo-15390858.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 110000,
    description: 'Sân pickleball hiện đại cho anh em mê môn này.',
    amenities: ['Vợt Pickleball A1', 'Wifi'],
    subCourts: [{ id: 'sub-c23-1', name: 'Sân Pick 2', slots: {} }]
  },
  {
    id: 'court-24',
    name: 'Sân Bóng Chuyền Hòa Lạc 2',
    sport: 'volleyball',
    address: 'Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.2,
    reviewsCount: 7,
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=800',
    priceMin: 95000,
    description: 'Sân bóng chuyền ngoài trời, không khí tuyệt vời.',
    amenities: ['Đèn sáng', 'Ghế ngồi'],
    subCourts: [{ id: 'sub-c24-1', name: 'Sân Truyền 2', slots: {} }]
  },
  {
    id: 'court-25',
    name: 'Sân Golf 3D Bình Yên Pro',
    sport: 'golf',
    address: 'Bình Yên, Thạch Thất, Hà Nội',
    district: 'Bình Yên',
    rating: 4.7,
    reviewsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800',
    priceMin: 320000,
    description: 'Phòng golf 3D cao cấp, công nghệ mới nhất.',
    amenities: ['Phần mềm phân tích Swing', 'Cho mượn gậy Callaway', 'Trà chiều thượng hạng'],
    subCourts: [{ id: 'sub-c25-1', name: 'Phòng Gold 2', slots: {} }]
  },
  {
    id: 'court-26',
    name: 'Sân Bóng 5 Hòa Lạc Star',
    sport: 'soccer',
    address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.7,
    reviewsCount: 52,
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 240000,
    description: 'Sân bóng 5 người hiện đại với bề mặt cỏ nhân tạo chuẩn và hệ thống chiếu sáng mạnh.',
    amenities: ['Đèn LED xuyên đêm', 'Bãi xe rộng', 'Căn tin phục vụ'],
    subCourts: [{ id: 'sub-c26-1', name: 'Sân 5 người Hòa Lạc', slots: {} }]
  },
  {
    id: 'court-27',
    name: 'Trung tâm Cầu Lông Hòa Lạc Elite',
    sport: 'badminton',
    address: 'Đường vòng Hồ Dầu, Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.8,
    reviewsCount: 64,
    imageUrl: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 95000,
    description: 'Câu lạc bộ cầu lông chuyên nghiệp với thảm Yonex và huấn luyện viên đội tuyển.',
    amenities: ['Huấn luyện viên cá nhân', 'Cho mượn vợt', 'Phòng thay đồ'],
    subCourts: [{ id: 'sub-c27-1', name: 'Sân Elite 1', slots: {} }, { id: 'sub-c27-2', name: 'Sân Elite 2', slots: {} }]
  },
  {
    id: 'court-28',
    name: 'Quần Vợt Hòa Lạc Premium',
    sport: 'tennis',
    address: 'Cổng Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.6,
    reviewsCount: 38,
    imageUrl: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 180000,
    description: 'Cum sân tennis ngoài trời đẹp, có phục vụ nước và khu nghỉ ngơi.',
    amenities: ['Lưới chuẩn', 'Ghế khán giả', 'Cho thuê bóng'],
    subCourts: [{ id: 'sub-c28-1', name: 'Sân Tennis 1', slots: {} }]
  },
  {
    id: 'court-29',
    name: 'Sân Bóng Rổ Hòa Lạc Hub',
    sport: 'basketball',
    address: 'Khu Đại học Quốc gia, Hòa Lạc, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.5,
    reviewsCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&q=80&w=800',
    priceMin: 145000,
    description: 'Sân bóng rổ indoor/outdoor với bảng rổ tiêu chuẩn và sàn lát composite chất lượng.',
    amenities: ['Bảng điện tử', 'Cho thuê bóng', 'Ghế ngồi'],
    subCourts: [{ id: 'sub-c29-1', name: 'Sân Rổ Hub', slots: {} }]
  },
  {
    id: 'court-30',
    name: 'Sân Pickleball Hòa Lạc Xanh',
    sport: 'pickleball',
    address: 'Đường số 5, Khu Hòa Lạc, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.8,
    reviewsCount: 18,
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceMin: 115000,
    description: 'Sân pickleball mới với ánh sáng ban đêm và thiết kế sân chuyên biệt.',
    amenities: ['Cho thuê vợt', 'Nước uống miễn phí', 'Khu nghỉ'],
    subCourts: [{ id: 'sub-c30-1', name: 'Sân Pickleball Xanh', slots: {} }]
  },
  {
    id: 'court-31',
    name: 'Sân Bóng Chuyền Hòa Lạc',
    sport: 'volleyball',
    address: 'Khu liên hợp thể thao Hòa Lạc, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.5,
    reviewsCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800',
    priceMin: 105000,
    description: 'Sân bóng chuyền 2 bên với lưới căng chuẩn và hệ thống chiếu sáng tốt.',
    amenities: ['Đèn ban đêm', 'Ghế khán giả', 'Phòng thay đồ sạch'],
    subCourts: [{ id: 'sub-c31-1', name: 'Sân Chuyền Hòa Lạc', slots: {} }]
  },
  {
    id: 'court-32',
    name: 'Golf 3D Hòa Lạc Center',
    sport: 'golf',
    address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.8,
    reviewsCount: 26,
    imageUrl: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&q=80&w=800',
    priceMin: 340000,
    description: 'Golf 3D hiện đại với nhiều chế độ mô phỏng sân nổi tiếng.',
    amenities: ['Phần mềm Swing AI', 'Gậy Callaway', 'Khu nghỉ sang'],
    subCourts: [{ id: 'sub-c32-1', name: 'Phòng Golf 3D', slots: {} }]
  },
  {
    id: 'court-33',
    name: 'Sân Đa Năng Hòa Lạc Family',
    sport: 'all',
    address: 'Hòa Lạc, Thạch Thất, Hà Nội',
    district: 'Hòa Lạc',
    rating: 4.6,
    reviewsCount: 37,
    imageUrl: 'https://images.unsplash.com/photo-1473654729523-203e25dfda10?auto=format&fit=crop&q=80&w=800',
    priceMin: 95000,
    description: 'Khu sân đa năng phục vụ đá bóng, cầu lông, bóng chuyền và tennis mini.',
    amenities: ['Đa dạng môn', 'Đèn chiếu sáng', 'Phục vụ đồ uống'],
    subCourts: [{ id: 'sub-c33-1', name: 'Sân Đa Năng Family', slots: {} }]
  }
];

// Unauthenticated placeholder only; it is replaced by the authenticated API profile after login.
const INITIAL_USER: UserProfile = {
  id: '',
  full_name: 'SportRes User',
  name: 'SportRes User',
  avatar: '',
  role: 'player',
  skillLevels: {
    soccer: 'Beginner', badminton: 'Beginner', tennis: 'Beginner', basketball: 'Beginner',
    pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner',
  },
  favoriteSports: [],
};

const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    title: 'Sân Bóng Đại Nam',
    sport: 'soccer',
    courtId: 'court-5',
    courtName: 'Sân Bóng Đại Nam',
    address: 'Thạch Thất, HN',
    date: 'Hôm nay',
    time: '19:00',
    level: 'Intermediate',
    creatorId: 'user-001',
    creatorName: 'Duy Khánh',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    players: [
      { id: 'user-001', name: 'Duy Khánh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-011', name: 'Hoàng Nam', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-012', name: 'Vũ Trung', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-013', name: 'Minh Đức', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-014', name: 'Nhật Huy', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-015', name: 'Thế Anh', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-016', name: 'Tuấn Kiệt', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', skill: 'Khá' },
      { id: 'user-017', name: 'Văn Đạt', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200', skill: 'Khá' }
    ],
    maxPlayers: 10,
    pricePerPlayer: 50000,
    status: 'open',
    description: 'Kèo giao hữu phủi 5v5 chia nước sân vui vẻ, cần thêm anh em chạy cánh nhiệt tình!'
  },
  {
    id: 'match-2',
    title: 'CLB Cầu Lông Kỳ Hòa',
    sport: 'badminton',
    courtId: 'court-6',
    courtName: 'CLB Cầu Lông Kỳ Hòa',
    address: 'Thạch Thất, HN',
    date: 'Ngày mai',
    time: '08:00',
    level: 'Pro',
    creatorId: 'user-002',
    creatorName: 'Phạm Minh Đức',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    players: [
      { id: 'user-002', name: 'Phạm Minh Đức', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', skill: 'Bán chuyên' },
      { id: 'user-021', name: 'Thế Anh Lâm', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200', skill: 'Chuyên nghiệp' }
    ],
    maxPlayers: 3,
    pricePerPlayer: 35000,
    status: 'open',
    description: 'Tuyển thêm một tay vợt cứng đánh đôi giao lưu nâng cao trình độ. Có nước lạnh miễn phí.'
  },
  {
    id: 'match-3',
    title: 'Sân Pickleball Thủ Thiêm',
    sport: 'pickleball',
    courtId: 'court-10',
    courtName: 'Sân Pickleball Thủ Thiêm',
    address: 'Thạch Thất, HN',
    date: 'Chủ nhật',
    time: '17:30',
    level: 'Beginner',
    creatorId: 'user-003',
    creatorName: 'Nguyễn Thị Hoa',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    players: [
      { id: 'user-003', name: 'Nguyễn Thị Hoa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', skill: 'Mới chơi' }
    ],
    maxPlayers: 4,
    pricePerPlayer: 60000,
    status: 'open',
    description: 'Sân chơi giao hữu vui vẻ cho các bạn mới làm quen với Pickleball. Có người hỗ trợ hướng dẫn luật cơ bản.'
  }
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tour-1',
    title: 'SportRes Copa Saigon 2026',
    sport: 'soccer',
    status: 'ongoing',
    date: '15/05/2026 - 15/06/2026',
    venue: 'Sân bóng Sư Vạn Hạnh',
    participantsLimit: 8,
    registeredCount: 8,
    prizePool: '15.000.000 VND',
    imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800',
    bracket: {
      quarterFinals: [
        { team1: 'FC Kỳ Hòa', team2: 'Saigon Warriors', score1: 3, score2: 1, winner: 'FC Kỳ Hòa' },
        { team1: 'Cướp Biển FC', team2: 'Quận 10 United', score1: 2, score2: 4, winner: 'Quận 10 United' },
        { team1: 'BadBoys FC', team2: 'Lão Tướng FC', score1: 0, score2: 2, winner: 'Lão Tướng FC' },
        { team1: 'Golden Stars', team2: 'Trẻ Đa Kao', score1: 1, score2: 1, winner: 'Golden Stars' }, // Won on penalty
      ],
      semiFinals: [
        { team1: 'FC Kỳ Hòa', team2: 'Quận 10 United', score1: 2, score2: 2, winner: 'FC Kỳ Hòa' },
        { team1: 'Lão Tướng FC', team2: 'Golden Stars', score1: 1, score2: 3, winner: 'Golden Stars' },
      ],
      finals: [
        { team1: 'FC Kỳ Hòa', team2: 'Golden Stars' },
      ]
    }
  },
  {
    id: 'tour-2',
    title: 'Vô địch cầu lông nghiệp dư Cúp SportRes',
    sport: 'badminton',
    status: 'upcoming',
    date: '10/06/2026 - 12/06/2026',
    venue: 'CLB Cầu lông Hùng Vương Plaza',
    participantsLimit: 16,
    registeredCount: 11,
    prizePool: '8.000.000 VND',
    imageUrl: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'tour-3',
    title: 'Cúp 5 Người Hòa Lạc 2026',
    sport: 'soccer',
    status: 'upcoming',
    date: '20/06/2026 - 28/06/2026',
    venue: 'Sân Bóng 5 Hòa Lạc Star',
    participantsLimit: 12,
    registeredCount: 9,
    prizePool: '12.000.000 VND',
    imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'tour-4',
    title: 'Hòa Lạc Badminton Open',
    sport: 'badminton',
    status: 'upcoming',
    date: '01/07/2026 - 02/07/2026',
    venue: 'Trung tâm Cầu Lông Hòa Lạc Elite',
    participantsLimit: 24,
    registeredCount: 18,
    prizePool: '10.000.000 VND',
    imageUrl: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'tour-5',
    title: 'Giải Quần Vợt Hòa Lạc Premium',
    sport: 'tennis',
    status: 'upcoming',
    date: '05/07/2026 - 08/07/2026',
    venue: 'Quần Vợt Hòa Lạc Premium',
    participantsLimit: 16,
    registeredCount: 13,
    prizePool: '9.500.000 VND',
    imageUrl: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'tour-6',
    title: 'Hòa Lạc Pickleball Championship',
    sport: 'pickleball',
    status: 'upcoming',
    date: '10/07/2026 - 12/07/2026',
    venue: 'Sân Pickleball Hòa Lạc Xanh',
    participantsLimit: 20,
    registeredCount: 12,
    prizePool: '7.000.000 VND',
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'tour-7',
    title: 'Giải Bóng Chuyền Hòa Lạc League',
    sport: 'volleyball',
    status: 'ongoing',
    date: '01/06/2026 - 20/06/2026',
    venue: 'Sân Bóng Chuyền Hòa Lạc',
    participantsLimit: 10,
    registeredCount: 10,
    prizePool: '5.000.000 VND',
    imageUrl: 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'tour-8',
    title: 'Golf 3D Hòa Lạc Challenge',
    sport: 'golf',
    status: 'upcoming',
    date: '18/07/2026 - 19/07/2026',
    venue: 'Golf 3D Hòa Lạc Center',
    participantsLimit: 12,
    registeredCount: 8,
    prizePool: '10.000.000 VND',
    imageUrl: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&q=80&w=800',
  }
];

const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'user-player2',
    name: 'Nguyễn Văn Đạt',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    favoriteSport: '⚽ Bóng đá',
    status: 'online',
    statusText: 'Sẵn sàng ghép sân'
  },
  {
    id: 'user-player3',
    name: 'Lê Duy Khánh',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    favoriteSport: '🏸 Cầu lông',
    status: 'busy',
    statusText: 'Đang tìm kèo'
  },
  {
    id: 'user-player5',
    name: 'Nguyễn Thị Hoa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    favoriteSport: '🎾 Tennis',
    status: 'offline',
    statusText: 'Offline'
  },
];

const INITIAL_PRIVATE_CHATS: PrivateChat[] = [
  {
    id: 'p-chat-user-player2',
    participantId: 'user-player2',
    participantName: 'Nguyễn Văn Đạt',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: 'Hẹn tối nay đá kèo nhé?',
    time: '15 phút trước',
    unreadCount: 1,
    online: true,
    sport: '⚽ Bóng đá',
    history: [
      { id: 'chat-msg-1', sender: 'them', text: 'Hẹn tối nay đá kèo nhé?', time: '15:00' },
      { id: 'chat-msg-2', sender: 'me', text: 'Được nhé, mình ở Thạch Thất luôn.', time: '15:02' },
    ]
  },
  {
    id: 'p-chat-user-player3',
    participantId: 'user-player3',
    participantName: 'Lê Duy Khánh',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    lastMessage: 'Đội nhóm mình thiếu thêm người đánh đôi.',
    time: '1 giờ trước',
    unreadCount: 0,
    online: false,
    sport: '🏸 Cầu lông',
    history: [
      { id: 'chat-msg-3', sender: 'them', text: 'Đội nhóm mình thiếu thêm người đánh đôi.', time: '14:10' },
      { id: 'chat-msg-4', sender: 'me', text: 'Ok luôn, mình rảnh tối nay.', time: '14:15' },
    ]
  }
];

const INITIAL_FRIEND_REQUESTS: FriendRequest[] = [
  {
    id: 'fr-player4',
    fromUser: { id: 'user-player4', name: 'Phạm Minh Đức', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    toUser: { id: INITIAL_USER.id, name: INITIAL_USER.name, avatar: INITIAL_USER.avatar },
    status: 'pending',
    createdAt: new Date().toISOString(),
    message: 'Mình muốn kết bạn để cùng lên kế hoạch đá cho vui và giao lưu.'
  }
];

export const SportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(DATES_POOL[0]);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sportres_user');
    return saved ? normalizeUserProfile(JSON.parse(saved)) : normalizeUserProfile(INITIAL_USER);
  });

  const [courts, setCourts] = useState<Court[]>([]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sportres_bookings');
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        const seen = new Set<string>();
        return parsed.filter(b => {
          if (!b.id || seen.has(b.id)) {
            return false;
          }
          seen.add(b.id);
          return true;
        }).map(b => {
          const court = courts.find(c => c.id === b.courtId);
          return {
            ...b,
            timeSlotId: b.timeSlotId || '',
            venueId: b.venueId || court?.venueId,
            ownerId: b.ownerId || court?.ownerId,
            courtName: court?.name || b.courtName,
          };
        });
      } catch {
        return [];
      }
    }
    return [];
  });

  const [matches, setMatches] = useState<Match[]>([]);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [venueRequests, setVenueRequests] = useState<VenueRequest[]>(() => {
    const saved = localStorage.getItem('sportres_venue_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminUsers, setAdminUsers] = useState<DemoUser[]>([]);

  const [friends, setFriends] = useState<FriendItem[]>([]);

  const [privateChats, setPrivateChats] = useState<PrivateChat[]>([]);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [ownerDashboardStats, setOwnerDashboardStats] = useState<OwnerDashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });
  const [adminRevenueAnalytics, setAdminRevenueAnalytics] = useState<AdminRevenueAnalytics>({
    todayRevenue: 0,
    sevenDayRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenueSeries: [],
  });

  const refreshOwnerDashboardStats = async () => {
    if (!['venue_owner', 'admin', 'staff'].includes(user.role)) return;
    const stats = await apiRequest<OwnerDashboardStats>('/api/owner/dashboard-stats');
    setOwnerDashboardStats(stats);
  };

  const refreshAdminRevenueAnalytics = async () => {
    if (user.role !== 'admin') return;
    const analytics = await apiRequest<AdminRevenueAnalytics>('/api/admin/revenue-analytics');
    setAdminRevenueAnalytics(analytics);
  };

  const loadServerData = async () => {
    try {
      const [serverCourts, serverMatches, serverBookings, serverVenueRequests, serverNotifications] = await Promise.all([
        apiRequest<Court[]>('/api/courts'),
        apiRequest<Match[]>('/api/matches'),
        apiRequest<Booking[]>('/api/bookings'),
        apiRequest<VenueRequest[]>('/api/venue-requests'),
        getAuthToken() ? apiRequest<Notification[]>('/api/notifications') : Promise.resolve([]),
      ]);
      setCourts(serverCourts.map(court => ({
        ...court,
        imageUrl: getVenueCardImage(court),
      })));
      setMatches(serverMatches);
      setBookings(serverBookings);
      setVenueRequests(serverVenueRequests);
      setNotifications(serverNotifications);
      if (['venue_owner', 'admin', 'staff'].includes(user.role)) {
        await refreshOwnerDashboardStats();
      }
      if (user.role === 'admin') {
        await refreshAdminRevenueAnalytics();
      }
    } catch (error) {
      console.warn('[SportRes] Using local demo data because API hydration failed:', error);
    }
  };

  const loadAdminUsers = async () => {
    if (user.role !== 'admin') return;
    try {
      const users = await apiRequest<DemoUser[]>('/api/admin/users');
      setAdminUsers(users);
    } catch (error) {
      console.error('[admin:users]', error);
    }
  };

  const loadTimeSlots = async (courtId: string, date: string) => {
    const court = courts.find(item => item.id === courtId);
    if (!court) {
      console.error(`[time-slots] Court ${courtId} was not found in client state.`);
      return;
    }

    try {
      const slotGroups = await Promise.all(court.subCourts.map(async subCourt => ({
        subCourtId: subCourt.id,
        slots: (await apiRequest<any[]>(`/api/courts/${encodeURIComponent(subCourt.id)}/time-slots?date=${encodeURIComponent(date)}`))
          .map(slot => normalizeTimeSlot(slot, subCourt.pricePerHour || 0)),
      })));
      const slotMap = new Map(slotGroups.map(group => [group.subCourtId, group.slots]));
      const totalSlots = slotGroups.reduce((total, group) => total + group.slots.length, 0);

      if (totalSlots === 0) {
        console.warn(`[time-slots] Empty slot data for venue ${courtId} on ${date}.`);
      }

      setCourts(previous => previous.map(item => item.id !== courtId ? item : ({
        ...item,
        subCourts: item.subCourts.map(subCourt => ({
          ...subCourt,
          slots: {
            ...subCourt.slots,
            [date]: slotMap.get(subCourt.id) || [],
          },
        })),
      })));
    } catch (error) {
      console.error(`[time-slots] Failed to load slots for venue ${courtId} on ${date}:`, error);
      throw error;
    }
  };

  const mergeCourtSlots = (venueId: string, courtId: string, date: string, slots: TimeSlot[]) => {
    setCourts(previous => previous.map(venue => venue.id !== venueId ? venue : ({
      ...venue,
      subCourts: venue.subCourts.map(court => court.id !== courtId ? court : ({
        ...court,
        slots: { ...court.slots, [date]: slots },
      })),
    })));
  };

  const loadOwnerSchedule = async (venueId: string, courtId: string, date: string) => {
    const schedule = await apiRequest<CourtSchedule>(
      `/api/owner/courts/${encodeURIComponent(courtId)}/time-slots?date=${encodeURIComponent(date)}`,
    );
    const courtPrice = schedule.pricePerHour
      || courts.find(venue => venue.id === venueId)?.subCourts.find(court => court.id === courtId)?.pricePerHour
      || 0;
    schedule.slots = schedule.slots.map(slot => normalizeTimeSlot(slot, courtPrice));
    mergeCourtSlots(venueId, courtId, date, schedule.slots);
    return schedule;
  };

  const saveOwnerSchedule = async (venueId: string, schedule: CourtSchedule, generate = false) => {
    const path = generate
      ? `/api/owner/courts/${encodeURIComponent(schedule.courtId)}/time-slots/generate`
      : `/api/owner/courts/${encodeURIComponent(schedule.courtId)}/schedule`;
    const response = await apiRequest<{ success: boolean; slots?: TimeSlot[] }>(path, {
      method: generate ? 'POST' : 'PATCH',
      body: JSON.stringify(schedule),
    });
    const refreshed = generate && response.slots
      ? { ...schedule, slots: response.slots }
      : await loadOwnerSchedule(venueId, schedule.courtId, schedule.date);
    mergeCourtSlots(venueId, schedule.courtId, schedule.date, refreshed.slots);
    return refreshed;
  };

  const updateOwnerSlotStatus = async (
    venueId: string,
    courtId: string,
    date: string,
    slotId: string,
    status: 'available' | 'locked' | 'maintenance',
  ) => {
    await apiRequest(`/api/owner/time-slots/${encodeURIComponent(slotId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await loadOwnerSchedule(venueId, courtId, date);
  };

  const createOwnerCourt = async (payload: {
    venueId: string;
    name: string;
    address?: string;
    sport: Exclude<SportType, 'all'>;
    pricePerHour: number;
    status: 'open' | 'closed' | 'maintenance';
    description?: string;
  }) => {
    await apiRequest('/api/courts', {
      method: 'POST',
      body: JSON.stringify({
        venueId: payload.venueId,
        name: payload.name,
        address: payload.address,
        sport: payload.sport,
        pricePerHour: payload.pricePerHour,
        status: payload.status,
        description: payload.description,
      }),
    });
    await loadServerData();
  };

  const updateOwnerCourt = async (
    courtId: string,
    payload: {
      name: string;
      address?: string;
      sport: Exclude<SportType, 'all'>;
      pricePerHour: number;
      status: 'open' | 'closed' | 'maintenance';
      description?: string;
    },
  ) => {
    await apiRequest(`/api/owner/courts/${encodeURIComponent(courtId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await loadServerData();
  };

  const deleteOwnerCourt = async (courtId: string) => {
    await apiRequest(`/api/owner/courts/${encodeURIComponent(courtId)}`, { method: 'DELETE' });
    await loadServerData();
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiRequest<{ user: UserProfile }>('/api/me')
        .then(data => setUser(normalizeUserProfile(data.user)))
        .catch(() => localStorage.removeItem(AUTH_TOKEN_KEY))
        .finally(() => loadServerData());
    } else {
      loadServerData();
    }
  }, []);

  useEffect(() => {
    if (user.role === 'admin' && getAuthToken()) {
      loadAdminUsers();
      refreshAdminRevenueAnalytics().catch(error => console.error('[admin:revenue-analytics]', error));
    }
  }, [user.role]);

  const isFriend = (id: string) => friends.some(f => f.id === id);

  const sendFriendRequest = (player: { id: string; name: string; avatar: string }) => {
    if (isFriend(player.id)) return;
    if (friendRequests.some(req => req.fromUser.id === user.id && req.toUser.id === player.id && req.status === 'pending')) return;

    const newRequest: FriendRequest = {
      id: `fr-${player.id}-${Date.now()}`,
      fromUser: { id: user.id, name: user.name, avatar: user.avatar },
      toUser: { id: player.id, name: player.name, avatar: player.avatar },
      status: 'pending',
      createdAt: new Date().toISOString(),
      message: 'Mình muốn kết bạn để cùng chơi thể thao và tìm đối thủ giao lưu.'
    };

    setFriendRequests(prev => [newRequest, ...prev]);
  };

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(req => req.id === requestId);
    if (!request || request.status !== 'pending') return;

    setFriendRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'accepted' } : req));
    if (!isFriend(request.fromUser.id)) {
      setFriends(prev => [
        ...prev,
        {
          id: request.fromUser.id,
          name: request.fromUser.name,
          avatar: request.fromUser.avatar,
          favoriteSport: '🏀 Thể thao',
          status: 'online',
          statusText: 'Đã chấp nhận kết bạn'
        }
      ]);
    }
  };

  const declineFriendRequest = (requestId: string) => {
    setFriendRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'declined' } : req));
  };

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
    setPrivateChats(prev => prev.filter(chat => chat.participantId !== friendId));
  };

  const startPrivateChatWith = (participant: { id: string; name: string; avatar: string; favoriteSport?: string; status?: FriendItem['status']; statusText?: string }) => {
    const foundChat = privateChats.find(chat => chat.participantId === participant.id);
    if (foundChat) {
      const updatedChat = { ...foundChat, unreadCount: 0 };
      setPrivateChats(prev => [updatedChat, ...prev.filter(chat => chat.id !== foundChat.id)]);
      return updatedChat;
    }

    const newChat: PrivateChat = {
      id: `p-chat-${participant.id}`,
      participantId: participant.id,
      participantName: participant.name,
      participantAvatar: participant.avatar,
      lastMessage: 'Đã bắt đầu cuộc trò chuyện',
      time: 'Mới',
      unreadCount: 0,
      online: participant.status === 'online',
      sport: participant.favoriteSport || '🏟️ Thể thao',
      history: [
        {
          id: `msg-${Date.now()}`,
          sender: 'them',
          text: 'Chào bạn! Mình đã mở cuộc trò chuyện với bạn.',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setPrivateChats(prev => [newChat, ...prev]);

    if (!isFriend(participant.id)) {
      setFriends(prev => [
        ...prev,
        {
          id: participant.id,
          name: participant.name,
          avatar: participant.avatar,
          favoriteSport: participant.favoriteSport ?? '🏟️ Thể thao',
          status: participant.status ?? 'offline',
          statusText: participant.statusText ?? 'Bạn mới'
        }
      ]);
    }

    return newChat;
  };

  const sendPrivateMessage = (chatId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setPrivateChats(prev => prev.map(chat => {
      if (chat.id !== chatId) return chat;
      const updatedHistory = [
        ...chat.history,
        { id: `msg-${Date.now()}`, sender: 'me', text, time: timestamp }
      ];
      return {
        ...chat,
        lastMessage: text,
        time: 'Vừa xong',
        unreadCount: 0,
        history: updatedHistory
      };
    }));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sportres_user', JSON.stringify(user));
    localStorage.setItem('sportres_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sportres_courts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem('sportres_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sportres_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('sportres_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('sportres_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sportres_venue_requests', JSON.stringify(venueRequests));
  }, [venueRequests]);

  useEffect(() => {
    localStorage.setItem('sportres_friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('sportres_private_chats', JSON.stringify(privateChats));
  }, [privateChats]);

  useEffect(() => {
    localStorage.setItem('sportres_friend_requests', JSON.stringify(friendRequests));
  }, [friendRequests]);

  const setBookingRollback = (courtId: string, subCourtId: string, date: string, slotId: string, bookingId: string, message: string) => {
    console.error('[booking:create] database save failed:', message);
    setBookings(prev => prev.filter(item => item.id !== bookingId));
    setCourts(prevCourts => prevCourts.map(c => {
      if (c.id !== courtId) return c;
      return {
        ...c,
        subCourts: c.subCourts.map(sub => {
          if (sub.id !== subCourtId) return sub;
          return {
            ...sub,
            slots: {
              ...sub.slots,
              [date]: (sub.slots[date] || []).map(slot => slot.id === slotId ? { ...slot, isBooked: false, isBlocked: false } : slot),
            },
          };
        }),
      };
    }));
    loadServerData();
  };

  const createBookings = async (
    selectedSlots: TimeSlot[],
    date: string,
    customExtras: { rackets: number; water: number },
  ): Promise<{ success: boolean; error?: string; bookings?: Booking[] }> => {
    if (selectedSlots.length === 0) return { success: false, error: 'Vui lòng chọn ít nhất một khung giờ.' };

    const invalidSelection = selectedSlots.find(slot =>
      !slot.id ||
      !slot.court_id ||
      !slot.venue_id ||
      !slot.start_time ||
      !slot.end_time ||
      slot.status !== 'available',
    );
    if (invalidSelection) {
      console.error('[booking:invalid-slot]', invalidSelection);
      return {
        success: false,
        error: 'Khung giờ này chưa được tạo trong hệ thống. Vui lòng thử lại hoặc chọn ngày khác.',
      };
    }

    const timeSlotIds = selectedSlots.map(slot => slot.id);
    const extrasPrice = (customExtras.rackets * 25000) + (customExtras.water * 10000);
    console.info('[booking:submit-slots]', {
      timeSlotIds,
      selectedDate: date,
      slots: selectedSlots.map(slot => ({
        id: slot.id,
        court_id: slot.court_id,
        venue_id: slot.venue_id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        status: slot.status,
      })),
    });

    try {
      const response = await apiRequest<{ bookings: Booking[] }>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({ timeSlotIds, date, extrasPrice }),
      });
      const savedBookings = response.bookings.filter(Boolean);
      setBookings(previous => [...savedBookings, ...previous]);
      const selectedIds = new Set(timeSlotIds);
      setCourts(previous => previous.map(venue => ({
        ...venue,
        subCourts: venue.subCourts.map(court => ({
          ...court,
          slots: {
            ...court.slots,
            [date]: (court.slots[date] || []).map(slot => selectedIds.has(slot.id)
              ? { ...slot, status: 'blocked', isBlocked: true }
              : slot),
          },
        })),
      })));
      await loadServerData();
      return { success: true, bookings: savedBookings };
    } catch (error: any) {
      await loadServerData();
      return { success: false, error: error.message };
    }
  };

  const confirmBookingTransfer = async (bookingId: string) => {
    await apiRequest(`/api/bookings/${bookingId}/confirm-transfer`, { method: 'POST' });
    setBookings(previous => previous.map(booking => booking.id === bookingId
      ? { ...booking, paymentStatus: 'waiting_admin_confirmation' }
      : booking));
    await loadServerData();
  };

  const approveBookingPayment = async (bookingId: string) => {
    await apiRequest(`/api/admin/bookings/${bookingId}/approve-payment`, { method: 'POST' });
    await loadServerData();
  };

  const rejectBookingPayment = async (bookingId: string) => {
    await apiRequest(`/api/admin/bookings/${bookingId}/reject-payment`, { method: 'POST' });
    await loadServerData();
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status === 'cancelled' || booking.status === 'payment_rejected') return;

    // Reopen slot
    setCourts(prevCourts => {
      return prevCourts.map(c => {
        if (c.id === booking.courtId) {
          return {
            ...c,
            subCourts: c.subCourts.map(sub => {
              if (sub.id === booking.subCourtId) {
                const dateSlots = sub.slots[booking.date] || [];
                const updatedDaySlots = dateSlots.map(s => {
                  if (s.time === booking.timeSlot) {
                    return { ...s, isBooked: false };
                  }
                  return s;
                });
                return {
                  ...sub,
                  slots: {
                    ...sub.slots,
                    [booking.date]: updatedDaySlots,
                  }
                };
              }
              return sub;
            })
          };
        }
        return c;
      });
    });

    // Mark as cancelled
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
    apiRequest('/api/bookings/' + bookingId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    }).then(loadServerData).catch(error => console.error('[booking:cancel]', error));
  };

  const updateSlotAvailability = (courtId: string, subCourtId: string, date: string, slotId: string, available: boolean) => {
    setCourts(prevCourts => prevCourts.map(c => {
      if (c.id !== courtId) return c;
      return {
        ...c,
        subCourts: c.subCourts.map(sub => {
          if (sub.id !== subCourtId) return sub;
          const dateSlots = sub.slots[date] || [];
          const target = dateSlots.find(slot => slot.id === slotId);
          if (target?.isBooked) return sub;
          return {
            ...sub,
            slots: {
              ...sub.slots,
              [date]: dateSlots.map(s => s.id === slotId ? { ...s, isBlocked: !available } : s),
            }
          };
        })
      };
    }));
    apiRequest(`/api/courts/${encodeURIComponent(subCourtId)}/time-slots/${encodeURIComponent(slotId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ blocked: !available }),
    }).catch(error => {
      console.error('[time-slots:update]', error);
      loadTimeSlots(courtId, date).catch(() => undefined);
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    apiRequest(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' })
      .then(() => loadServerData())
      .catch(error => {
        console.error('[notification:read]', error);
        loadServerData();
      });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    apiRequest('/api/notifications/read-all', { method: 'POST' })
      .then(() => loadServerData())
      .catch(error => {
        console.error('[notification:read-all]', error);
        loadServerData();
      });
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    apiRequest(`/api/notifications/${encodeURIComponent(notificationId)}`, { method: 'DELETE' })
      .catch(error => {
        console.error('[notification:delete]', error);
        loadServerData();
      });
  };

  const submitVenueRequest = (request: Omit<VenueRequest, 'id' | 'ownerId' | 'ownerName' | 'ownerPhone' | 'status' | 'createdAt' | 'reviewedAt' | 'rejectionReason'>) => {
    const nextRequest: VenueRequest = {
      ...request,
      id: `venue-request-${Date.now()}`,
      ownerId: user.id,
      ownerName: user.name,
      ownerPhone: user.phone,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setVenueRequests(prev => [nextRequest, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-admin-venue-request-${nextRequest.id}`,
        type: 'system',
        recipientUserId: 'user-admin',
        ownerId: user.id,
        referenceId: nextRequest.id,
        title: 'Yêu cầu thêm sân mới',
        body: `${user.name} vừa gửi yêu cầu thêm sân "${nextRequest.name}".`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    apiRequest<VenueRequest>('/api/venues', {
      method: 'POST',
      body: JSON.stringify(request),
    })
      .then(savedRequest => setVenueRequests(prev => [savedRequest, ...prev.filter(item => item.id !== nextRequest.id)]))
      .catch(error => console.error('[venue-request:create]', error));
    return nextRequest;
  };

  const approveVenueRequest = (requestId: string) => {
    const request = venueRequests.find(item => item.id === requestId);
    if (!request || request.status !== 'pending') return;

    const newCourt = buildCourtFromVenueRequest(request);
    setCourts(prev => [newCourt, ...prev]);
    setVenueRequests(prev => prev.map(item => item.id === requestId ? {
      ...item,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      rejectionReason: undefined,
    } : item));
    setNotifications(prev => [
      {
        id: `notif-approved-${requestId}`,
        type: 'system',
        recipientUserId: request.ownerId,
        ownerId: request.ownerId,
        referenceId: requestId,
        title: 'Yêu cầu thêm sân đã được duyệt',
        body: `Sân "${request.name}" đã được duyệt và xuất hiện trong dashboard của bạn.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    apiRequest(`/api/venue-requests/${requestId}/approve`, { method: 'POST' })
      .then(loadServerData)
      .catch(error => console.error('[venue-request:approve]', error));
  };

  const rejectVenueRequestSubmission = (requestId: string, reason?: string) => {
    const request = venueRequests.find(item => item.id === requestId);
    if (!request || request.status !== 'pending') return;

    setVenueRequests(prev => prev.map(item => item.id === requestId ? {
      ...item,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason || 'Cần bổ sung thông tin hồ sơ sân.',
    } : item));
    setNotifications(prev => [
      {
        id: `notif-rejected-${requestId}`,
        type: 'system',
        recipientUserId: request.ownerId,
        ownerId: request.ownerId,
        referenceId: requestId,
        title: 'Yêu cầu thêm sân bị từ chối',
        body: `Yêu cầu cho sân "${request.name}" đã bị từ chối.${reason ? ` Lý do: ${reason}` : ''}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    apiRequest(`/api/venue-requests/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
      .then(loadServerData)
      .catch(error => console.error('[venue-request:reject]', error));
  };

  const joinMatchID = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return { success: false, error: 'Không tìm thấy trận đấu' };

    if (match.players.length >= match.maxPlayers) {
      return { success: false, error: 'Kèo đấu đã đủ người rồi!' };
    }

    if (match.players.some(p => p.id === user.id)) {
      return { success: false, error: 'Bạn đã tham gia trận đấu này rồi.' };
    }

    // Add player
    setMatches(prevMatches => {
      return prevMatches.map(m => {
        if (m.id === matchId) {
          const updatedPlayers = [
            ...m.players,
            {
              id: user.id,
              name: user.name,
              avatar: user.avatar,
              sport: m.sport,
              skill: user.skillLevels[m.sport],
              status: 'joined' as const,
              joinedAt: new Date().toISOString(),
            }
          ];
          const isFull = updatedPlayers.length >= m.maxPlayers;
          return {
            ...m,
            players: updatedPlayers,
            status: isFull ? 'full' as const : 'open' as const,
          };
        }
        return m;
      });
    });

    apiRequest(`/api/matches/${matchId}/join`, { method: 'POST' })
      .then(loadServerData)
      .catch(error => console.error('[match:join]', error));

    return { success: true };
  };

  const leaveMatchID = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const isParticipant = match.players.some(p => p.id === user.id);
    if (!isParticipant) return;

    setMatches(prevMatches => {
      return prevMatches.map(m => {
        if (m.id === matchId) {
          const updatedPlayers = m.players.filter(p => p.id !== user.id);
          return {
            ...m,
            players: updatedPlayers,
            status: 'open' as const,
          };
        }
        return m;
      });
    });
    apiRequest(`/api/matches/${matchId}/leave`, { method: 'POST' })
      .then(loadServerData)
      .catch(error => console.error('[match:leave]', error));
  };

  const createMatch = (matchData: Omit<Match, 'id' | 'players' | 'status' | 'creatorId' | 'creatorName' | 'creatorAvatar'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      players: [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          sport: matchData.sport,
          skill: user.skillLevels[matchData.sport],
          status: 'joined',
          joinedAt: new Date().toISOString(),
        }
      ],
      status: 'open',
    };

    setMatches(prev => [newMatch, ...prev]);
    apiRequest<Match>('/api/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    })
      .then(savedMatch => setMatches(prev => [savedMatch, ...prev.filter(item => item.id !== newMatch.id)]))
      .then(loadServerData)
      .catch(error => console.error('[match:create]', error));
    return newMatch;
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    const nextProfile = normalizeUserProfile({
      ...user,
      ...profile,
      full_name: profile.name || profile.full_name || user.name,
      skillLevels: {
        ...user.skillLevels,
        ...(profile.skillLevels || {}),
      },
    });
    setUser(nextProfile);
    try {
      const data = await apiRequest<{ user: UserProfile }>('/api/me/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          fullName: nextProfile.name,
          gender: nextProfile.gender,
          activeArea: nextProfile.activeArea,
          favoriteSports: nextProfile.favoriteSports,
          skillLevels: nextProfile.skillLevels,
          avatarUrl: profile.avatar !== undefined ? profile.avatar : undefined,
        }),
      });
      const savedProfile = normalizeUserProfile(data.user);
      setUser(savedProfile);
      return savedProfile;
    } catch (error) {
      setUser(user);
      throw error;
    }
  };

  const uploadUserAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await apiRequest<{ user: UserProfile; avatarUrl: string }>('/api/me/avatar', {
      method: 'POST',
      body: formData,
    });
    const savedProfile = normalizeUserProfile(data.user);
    setUser(savedProfile);
    return savedProfile;
  };

  const changePassword = async (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    const data = await apiRequest<{ success: boolean; message?: string }>('/api/profile/change-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.message || 'Đổi mật khẩu thành công.';
  };

  const uploadOwnerCoverImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await apiRequest<{ owner_cover_url: string; ownerCoverUrl?: string; imageUrl?: string; updatedCourtIds?: string[] }>('/api/owner/cover', {
      method: 'POST',
      body: formData,
    });
    const coverUrl = data.owner_cover_url || data.ownerCoverUrl || data.imageUrl || '';
    setCourts(previous => previous.map(venue => (
      venue.ownerId === user.id
        ? {
          ...venue,
          ownerCoverUrl: coverUrl,
          imageUrl: coverUrl || venue.imageUrl,
          subCourts: venue.subCourts.map(court => ({ ...court, imageUrl: coverUrl || court.imageUrl })),
        }
        : venue
    )));
    await loadServerData();
    return coverUrl;
  };

  const uploadOwnerCourtImage = async (courtId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const data = await apiRequest<{ imageUrl: string }>(`/api/owner/courts/${encodeURIComponent(courtId)}/image`, {
      method: 'POST',
      body: formData,
    });
    setCourts(previous => previous.map(venue => {
      const hasCourt = venue.subCourts.some(court => court.id === courtId);
      if (!hasCourt) return venue;
      return {
        ...venue,
        subCourts: venue.subCourts.map(court => court.id === courtId ? { ...court, imageUrl: data.imageUrl } : court),
      };
    }));
    await loadServerData();
    return data.imageUrl;
  };

  const loginUser = async (phone: string, password: string): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    try {
      const data = await apiRequest<{ token: string; user: UserProfile; role: UserRole }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      const normalizedUser = normalizeUserProfile(data.user);
      setUser(normalizedUser);
      await loadServerData();
      return { success: true, role: normalizedUser.role || (data.role === ('owner' as any) ? 'venue_owner' : data.role) };
    } catch (error: any) {
      return { success: false, error: error.message || 'Số điện thoại hoặc mật khẩu không đúng!' };
    }
  };

  const registerUser = async (payload: { fullName: string; phone: string; password: string }): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    try {
      const data = await apiRequest<{ token: string; user: UserProfile }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      const normalizedUser = normalizeUserProfile(data.user);
      setUser(normalizedUser);
      await loadServerData();
      return { success: true, role: normalizedUser.role };
    } catch (error: any) {
      return { success: false, error: error.message || 'Không thể tạo tài khoản.' };
    }
  };

  const createVenueOwner = async (payload: CreateVenueOwnerPayload) => {
    try {
      const result = await apiRequest<{
        success: true;
        owner: DemoUser;
        venue: { id: string; ownerId: string; name: string; address: string; district: string; status: string; sport: SportType };
      }>('/api/admin/venue-owners', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setAdminUsers(previous => [result.owner, ...previous.filter(item => item.username !== result.owner.username)]);
      await loadServerData();
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Không thể tạo tài khoản chủ sân.' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('sportres_user');
    setUser(normalizeUserProfile(INITIAL_USER));
  };

  const completeBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' as const } : b));
    apiRequest('/api/bookings/' + bookingId + '/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    }).then(loadServerData).catch(error => console.error('[booking:complete]', error));
  };
  const refreshAllData = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem('sportres_user');
    localStorage.removeItem('sportres_courts');
    localStorage.removeItem('sportres_bookings');
    localStorage.removeItem('sportres_matches');
    localStorage.removeItem('sportres_tournaments');
    localStorage.removeItem('sportres_notifications');
    localStorage.removeItem('sportres_venue_requests');
    localStorage.removeItem('sportres_friends');
    localStorage.removeItem('sportres_private_chats');
    localStorage.removeItem('sportres_friend_requests');
    setUser(normalizeUserProfile(INITIAL_USER));
    setCourts([]);
    setBookings([]);
    setMatches([]);
    setTournaments([]);
    setNotifications([]);
    setVenueRequests([]);
    setFriends([]);
    setPrivateChats([]);
    setFriendRequests([]);
  };

  return (
    <SportContext.Provider value={{
      user,
      courts,
      bookings,
      ownerDashboardStats,
      adminRevenueAnalytics,
      matches,
      tournaments,
      notifications,
      venueRequests,
      demoUsers: adminUsers,
      friends,
      privateChats,
      friendRequests,
      selectedDate,
      setSelectedDate,
      loadTimeSlots,
      loadOwnerSchedule,
      saveOwnerSchedule,
      updateOwnerSlotStatus,
      createOwnerCourt,
      updateOwnerCourt,
      deleteOwnerCourt,
      createBookings,
      confirmBookingTransfer,
      approveBookingPayment,
      rejectBookingPayment,
      cancelBooking,
      refreshOwnerDashboardStats,
      refreshAdminRevenueAnalytics,
      updateSlotAvailability,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      submitVenueRequest,
      approveVenueRequest,
      rejectVenueRequestSubmission,
      joinMatchID,
      leaveMatchID,
      createMatch,
      setCourts,
      refreshAllData,
      updateUserProfile,
      changePassword,
      uploadUserAvatar,
      uploadOwnerCoverImage,
      uploadOwnerCourtImage,
      loginUser,
      registerUser,
      createVenueOwner,
      logoutUser,
      completeBooking,
      selectedCourtId,
      setSelectedCourtId,
      selectedMatchId,
      setSelectedMatchId,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest,
      startPrivateChatWith,
      sendPrivateMessage,
      removeFriend,
    }}>
      {children}
    </SportContext.Provider>
  );
};

export const useSport = () => {
  const context = useContext(SportContext);
  if (!context) throw new Error('useSport must be used within a SportProvider');
  return context;
};
