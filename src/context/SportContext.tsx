import React, { createContext, useContext, useState, useEffect } from 'react';
import { Court, Booking, Match, UserProfile, Tournament, LeaderboardUser, SportType, TimeSlot, SubCourt, DemoUser, UserRole, FriendItem, PrivateChat, FriendRequest, Notification, VenueRequest } from '../types';

interface SportContextType {
  user: UserProfile;
  courts: Court[];
  bookings: Booking[];
  matches: Match[];
  tournaments: Tournament[];
  notifications: Notification[];
  venueRequests: VenueRequest[];
  leaderboards: { [key in SportType]: LeaderboardUser[] };
  demoUsers: DemoUser[];
  friends: FriendItem[];
  privateChats: PrivateChat[];
  friendRequests: FriendRequest[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  depositWallet: (amount: number) => void;
  createBooking: (courtId: string, subCourtId: string, date: string, slotId: string, customExtras: { rackets: number; water: number }) => { success: boolean; error?: string; booking?: Booking };
  cancelBooking: (bookingId: string) => void;
  acceptBooking: (bookingId: string) => void;
  rejectBooking: (bookingId: string) => void;
  autoConfirmBookings: () => void;
  updateSlotAvailability: (courtId: string, subCourtId: string, date: string, slotId: string, available: boolean) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  submitVenueRequest: (request: Omit<VenueRequest, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'ownerPhone' | 'status' | 'createdAt' | 'reviewedAt' | 'rejectionReason'>) => VenueRequest;
  approveVenueRequest: (requestId: string) => void;
  rejectVenueRequestSubmission: (requestId: string, reason?: string) => void;
  joinMatchID: (matchId: string) => { success: boolean; error?: string };
  leaveMatchID: (matchId: string) => void;
  createMatch: (matchData: Omit<Match, 'id' | 'players' | 'status' | 'creatorId' | 'creatorName' | 'creatorAvatar'>) => Match;
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  refreshAllData: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  loginUser: (username: string, password: string) => { success: boolean; error?: string; role?: UserRole };
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

// Helper to generate dynamic dates
const getOffsetDateString = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const DATES_POOL = [
  getOffsetDateString(0),
  getOffsetDateString(1),
  getOffsetDateString(2),
  getOffsetDateString(3),
  getOffsetDateString(4),
];

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
  return {
    ...profile,
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
  const imageUrl = court.imageUrl || '';
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
  const slotsConfig = [
    { time: '05:00 - 06:00', price: sport === 'badminton' ? 70000 : sport === 'soccer' ? 250000 : sport === 'tennis' ? 150000 : 180000, peak: false },
    { time: '06:00 - 07:00', price: sport === 'badminton' ? 70000 : sport === 'soccer' ? 250000 : sport === 'tennis' ? 150000 : 180000, peak: false },
    { time: '07:00 - 08:00', price: sport === 'badminton' ? 80000 : sport === 'soccer' ? 280000 : sport === 'tennis' ? 180000 : 200000, peak: false },
    { time: '08:00 - 09:00', price: sport === 'badminton' ? 80000 : sport === 'soccer' ? 280000 : sport === 'tennis' ? 180000 : 200000, peak: false },
    { time: '09:00 - 10:00', price: sport === 'badminton' ? 80000 : sport === 'soccer' ? 280000 : sport === 'tennis' ? 180000 : 200000, peak: false },
    { time: '14:00 - 15:00', price: sport === 'badminton' ? 85000 : sport === 'soccer' ? 300000 : sport === 'tennis' ? 200000 : 220000, peak: false },
    { time: '15:00 - 16:00', price: sport === 'badminton' ? 85000 : sport === 'soccer' ? 300000 : sport === 'tennis' ? 200000 : 220000, peak: false },
    { time: '16:00 - 17:00', price: sport === 'badminton' ? 110000 : sport === 'soccer' ? 450000 : sport === 'tennis' ? 240000 : 280000, peak: true },
    { time: '17:00 - 18:00', price: sport === 'badminton' ? 120000 : sport === 'soccer' ? 500000 : sport === 'tennis' ? 260000 : 320000, peak: true },
    { time: '18:00 - 19:00', price: sport === 'badminton' ? 120000 : sport === 'soccer' ? 500000 : sport === 'tennis' ? 260000 : 320000, peak: true },
    { time: '19:00 - 20:00', price: sport === 'badminton' ? 120000 : sport === 'soccer' ? 500000 : sport === 'tennis' ? 260000 : 320000, peak: true },
    { time: '20:00 - 21:00', price: sport === 'badminton' ? 110000 : sport === 'soccer' ? 420000 : sport === 'tennis' ? 240000 : 280000, peak: true },
    { time: '21:00 - 22:00', price: sport === 'badminton' ? 90000 : sport === 'soccer' ? 350000 : sport === 'tennis' ? 200000 : 220000, peak: false },
  ];

  return slotsConfig.map((s, index) => {
    // Randomly pre-book some slots to make it look active (except the user's mock bookings)
    const randomBooked = Math.random() < 0.35;
    return {
      id: `${sport}-slot-${index}`,
      time: s.time,
      price: s.price,
      isPeak: s.peak,
      isBooked: randomBooked,
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

// ============================================================
// DEMO USER ACCOUNTS
// ============================================================
const DEMO_USERS: DemoUser[] = [
  {
    username: 'player1', password: 'Sport@123', role: 'player',
    profile: {
      id: 'user-player1', name: 'Trần Minh Quân', email: 'minhquan@sportres.vn', phone: '0901234001', role: 'player',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Intermediate', badminton: 'Advanced', tennis: 'Beginner', basketball: 'Intermediate', pickleball: 'Intermediate', volleyball: 'Beginner', golf: 'Beginner', all: 'Intermediate' },
      walletBalance: 450000, points: 1540, tier: 'Vàng', favoriteSports: ['badminton', 'soccer'], gender: 'Nam', activeArea: 'Thạch Thất, Hà Nội',
    }
  },
  {
    username: 'player2', password: 'Sport@123', role: 'player',
    profile: {
      id: 'user-player2', name: 'Nguyễn Văn Đạt', email: 'vandat@sportres.vn', phone: '0901234002', role: 'player',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Advanced', badminton: 'Intermediate', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Intermediate' },
      walletBalance: 320000, points: 2420, tier: 'Vàng', favoriteSports: ['soccer', 'badminton'], gender: 'Nam', activeArea: 'Cầu Giấy, Hà Nội',
    }
  },
  {
    username: 'player3', password: 'Sport@123', role: 'player',
    profile: {
      id: 'user-player3', name: 'Lê Duy Khánh', email: 'duykhanh@sportres.vn', phone: '0901234003', role: 'player',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Advanced', badminton: 'Pro', tennis: 'Intermediate', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Advanced' },
      walletBalance: 580000, points: 2980, tier: 'Kim cương', favoriteSports: ['badminton', 'soccer'], gender: 'Nam', activeArea: 'Thạch Thất, Hà Nội',
    }
  },
  {
    username: 'player4', password: 'Sport@123', role: 'player',
    profile: {
      id: 'user-player4', name: 'Phạm Minh Đức', email: 'minhduc@sportres.vn', phone: '0901234004', role: 'player',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Pro', badminton: 'Advanced', tennis: 'Intermediate', basketball: 'Intermediate', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Advanced' },
      walletBalance: 750000, points: 2850, tier: 'Kim cương', favoriteSports: ['soccer', 'badminton'], gender: 'Nam', activeArea: 'Hòa Lạc, Hà Nội',
    }
  },
  {
    username: 'player5', password: 'Sport@123', role: 'player',
    profile: {
      id: 'user-player5', name: 'Nguyễn Thị Hoa', email: 'thihoa@sportres.vn', phone: '0901234005', role: 'player',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Beginner', badminton: 'Advanced', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Intermediate' },
      walletBalance: 200000, points: 1980, tier: 'Vàng', favoriteSports: ['badminton', 'pickleball'], gender: 'Nữ', activeArea: 'Cầu Giấy, Hà Nội',
    }
  },
  {
    username: 'owner1', password: 'Owner@123', role: 'venue_owner',
    profile: {
      id: 'user-owner1', name: 'Nguyễn Văn Sân', email: 'grasslands@sportres.vn', phone: '0987654001', role: 'venue_owner',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      skillLevels: { soccer: 'Intermediate', badminton: 'Beginner', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner' },
      walletBalance: 12500000, points: 0, tier: 'Đồng', favoriteSports: ['soccer'], gender: 'Nam', activeArea: 'Thạch Thất, Hà Nội',
    }
  },
  {
    username: 'owner2', password: 'Owner@123', role: 'venue_owner',
    profile: {
      id: 'user-owner2', name: 'Trần Thị Lan', email: 'hungvuong@sportres.vn', phone: '0987654002', role: 'venue_owner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      skillLevels: { soccer: 'Beginner', badminton: 'Intermediate', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner' },
      walletBalance: 8900000, points: 0, tier: 'Đồng', favoriteSports: ['badminton'], gender: 'Nữ', activeArea: 'Quận 5, TP.HCM',
    }
  },
  {
    username: 'staff1', password: 'Staff@123', role: 'staff',
    profile: {
      id: 'user-staff1', name: 'Lê Văn Nhân Viên', email: 'nhanvien1@sportres.vn', phone: '0976543001', role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200',
      skillLevels: { soccer: 'Beginner', badminton: 'Beginner', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner' },
      walletBalance: 0, points: 0, tier: 'Đồng', favoriteSports: [], gender: 'Nam', activeArea: 'Thạch Thất, Hà Nội',
    }
  },
  {
    username: 'staff2', password: 'Staff@123', role: 'staff',
    profile: {
      id: 'user-staff2', name: 'Phạm Thị Tiếp Tân', email: 'tieptan1@sportres.vn', phone: '0976543002', role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      skillLevels: { soccer: 'Beginner', badminton: 'Beginner', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner' },
      walletBalance: 0, points: 0, tier: 'Đồng', favoriteSports: [], gender: 'Nữ', activeArea: 'Hòa Lạc, Hà Nội',
    }
  },
  {
    username: 'admin', password: 'Admin@123', role: 'admin',
    profile: {
      id: 'user-admin', name: 'SportRes Admin', email: 'admin@sportres.vn', phone: '0900000001', role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      skillLevels: { soccer: 'Beginner', badminton: 'Beginner', tennis: 'Beginner', basketball: 'Beginner', pickleball: 'Beginner', volleyball: 'Beginner', golf: 'Beginner', all: 'Beginner' },
      walletBalance: 0, points: 0, tier: 'Kim cương', favoriteSports: [], gender: 'Nam', activeArea: 'Hà Nội',
    }
  },
];

const INITIAL_USER: UserProfile = DEMO_USERS[0].profile;

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

const INITIAL_LEADERBOARDS: { [key in SportType]: LeaderboardUser[] } = {
  soccer: [
    { rank: 1, name: 'Phạm Minh Đức', points: 2850, sport: 'soccer', winRate: '82%', matchesPlayed: 45, tier: 'Kim cương', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { rank: 2, name: 'Nguyễn Văn Đạt', points: 2420, sport: 'soccer', winRate: '71%', matchesPlayed: 38, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { rank: 3, name: 'Trần Minh Quân', points: 1540, sport: 'soccer', winRate: '65%', matchesPlayed: 24, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { rank: 4, name: 'Lê Sĩ Toàn', points: 1210, sport: 'soccer', winRate: '58%', matchesPlayed: 30, tier: 'Bạc', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
  ],
  badminton: [
    { rank: 1, name: 'Lê Duy Khánh', points: 2980, sport: 'badminton', winRate: '88%', matchesPlayed: 52, tier: 'Kim cương', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
    { rank: 2, name: 'Trần Minh Quân', points: 2120, sport: 'badminton', winRate: '75%', matchesPlayed: 31, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { rank: 3, name: 'Nguyễn Thị Hoa', points: 1980, sport: 'badminton', winRate: '72%', matchesPlayed: 40, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
    { rank: 4, name: 'Thế Anh Lâm', points: 1450, sport: 'badminton', winRate: '60%', matchesPlayed: 28, tier: 'Bạc', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200' },
  ],
  tennis: [
    { rank: 1, name: 'Andy Hoàng', points: 3150, sport: 'tennis', winRate: '90%', matchesPlayed: 38, tier: 'Kim cương', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
    { rank: 2, name: 'Trịnh Gia Bảo', points: 2200, sport: 'tennis', winRate: '70%', matchesPlayed: 34, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200' },
    { rank: 3, name: 'Lê Minh Hằng', points: 1510, sport: 'tennis', winRate: '63%', matchesPlayed: 22, tier: 'Bạc', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  ],
  basketball: [
    { rank: 1, name: 'Vũ Quốc Trung', points: 2640, sport: 'basketball', winRate: '80%', matchesPlayed: 44, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200' },
    { rank: 2, name: 'Trần Minh Quân', points: 1840, sport: 'basketball', winRate: '68%', matchesPlayed: 28, tier: 'Vàng', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
    { rank: 3, name: 'Đặng Tuấn Kiệt', points: 1650, sport: 'basketball', winRate: '66%', matchesPlayed: 30, tier: 'Bạc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  ],
  pickleball: [],
  volleyball: [],
  golf: [],
  all: []
};

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

  const [courts, setCourts] = useState<Court[]>(() => {
    const saved = localStorage.getItem('sportres_courts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length >= 9) return parsed.map(withCourtOwnership);
    }

    // Bootstrap initial slots for all dates
    return INITIAL_COURTS_DATA.map(court => {
      const updatedSubCourts = court.subCourts.map(sub => {
        const slotsMap: { [date: string]: TimeSlot[] } = {};
        DATES_POOL.forEach(date => {
          slotsMap[date] = generateSlotsForDay(court.sport);
        });
        return { ...sub, slots: slotsMap };
      });
      return withCourtOwnership({ ...court, subCourts: updatedSubCourts });
    });
  });

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

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('sportres_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('sportres_tournaments');
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('sportres_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-welcome-owner',
        type: 'system',
        title: 'Trung tâm thông báo SportRes',
        body: 'Booking mới, thay đổi lịch và phản hồi khách hàng sẽ xuất hiện tại đây.',
        isRead: true,
        createdAt: new Date().toISOString(),
      }
    ];
  });

  const [venueRequests, setVenueRequests] = useState<VenueRequest[]>(() => {
    const saved = localStorage.getItem('sportres_venue_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [friends, setFriends] = useState<FriendItem[]>(() => {
    const saved = localStorage.getItem('sportres_friends');
    return saved ? JSON.parse(saved) : INITIAL_FRIENDS;
  });

  const [privateChats, setPrivateChats] = useState<PrivateChat[]>(() => {
    const saved = localStorage.getItem('sportres_private_chats');
    return saved ? JSON.parse(saved) : INITIAL_PRIVATE_CHATS;
  });

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    const saved = localStorage.getItem('sportres_friend_requests');
    return saved ? JSON.parse(saved) : INITIAL_FRIEND_REQUESTS;
  });

  const [leaderboards] = useState<{ [key in SportType]: LeaderboardUser[] }>(INITIAL_LEADERBOARDS);
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

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

  const depositWallet = (amount: number) => {
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + amount }));
  };

  const createBooking = (
    courtId: string,
    subCourtId: string,
    date: string,
    slotId: string,
    customExtras: { rackets: number; water: number }
  ) => {
    // Find court & slot
    const court = courts.find(c => c.id === courtId);
    if (!court) return { success: false, error: 'Không tìm thấy thông tin sân.' };

    const subCourt = court.subCourts.find(s => s.id === subCourtId);
    if (!subCourt) return { success: false, error: 'Không tìm thấy phân sân.' };

    const dateSlots = subCourt.slots[date] || [];
    const slotIndex = dateSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) return { success: false, error: 'Khung giờ không hợp lệ.' };

    const slot = dateSlots[slotIndex];
    if (slot.isBooked || slot.isBlocked) return { success: false, error: 'Khung giờ này đã được đặt hoặc bị khóa.' };

    console.info('[booking:create] validated court payload', {
      courtId,
      venueId: court.venueId,
      ownerId: court.ownerId,
      courtName: court.name,
      subCourtId,
      slotId,
      date,
    });

    // Calculate details
    const extrasPrice = (customExtras.rackets * 25000) + (customExtras.water * 10000);
    const totalPrice = slot.price + extrasPrice;

    if (user.walletBalance < totalPrice) {
      return { success: false, error: `Số dư tài khoản ví không đủ. Cần thêm ${(totalPrice - user.walletBalance).toLocaleString('vi-VN')}đ.` };
    }

    // Deduct and book
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - totalPrice,
      points: prev.points + Math.floor(totalPrice / 1000), // 1 point for every 1K VND
    }));

    // Update slots booked status
    setCourts(prevCourts => {
      return prevCourts.map(c => {
        if (c.id === courtId) {
          return {
            ...c,
            subCourts: c.subCourts.map(sub => {
              if (sub.id === subCourtId) {
                const updatedDaySlots = [...sub.slots[date]];
                updatedDaySlots[slotIndex] = { ...slot, isBooked: true };
                return {
                  ...sub,
                  slots: {
                    ...sub.slots,
                    [date]: updatedDaySlots,
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

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      courtId,
      venueId: court.venueId,
      ownerId: court.ownerId,
      courtName: court.name,
      subCourtId,
      subCourtName: subCourt.name,
      sport: court.sport,
      customerId: user.id,
      customerName: user.name,
      customerPhone: user.phone,
      customerEmail: user.email,
      date,
      timeSlot: slot.time,
      price: totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      qrcode: `SPORTRES-B-${Date.now()}-${courtId}`
    };

    setBookings(prev => [newBooking, ...prev]);
    setNotifications(prev => [
      {
        id: `notif-booking-${newBooking.id}`,
        type: 'booking',
        ownerId: court.ownerId,
        venueId: court.venueId,
        referenceId: newBooking.id,
        title: 'Có booking mới cần xác nhận',
        body: `${user.name} vừa đặt ${court.name} - ${subCourt.name}, ${slot.time} ngày ${date}.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status === 'cancelled' || booking.status === 'rejected') return;

    // Refund 85% points & cash
    const refundAmount = Math.floor(booking.price * 0.85);
    if (!booking.customerId || booking.customerId === user.id) {
      setUser(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + refundAmount,
      }));
    }

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
  };

  const acceptBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'pending') return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' as const } : b));
    setNotifications(prev => [
      {
        id: `notif-accepted-${bookingId}`,
        type: 'booking',
        recipientUserId: booking.customerId,
        ownerId: booking.ownerId,
        venueId: booking.venueId,
        referenceId: bookingId,
        title: 'Booking đã được xác nhận',
        body: `${booking.courtName} - ${booking.subCourtName}, ${booking.timeSlot} ngày ${booking.date} đã được xác nhận.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const rejectBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || booking.status !== 'pending') return;

    setCourts(prevCourts => prevCourts.map(c => {
      if (c.id !== booking.courtId) return c;
      return {
        ...c,
        subCourts: c.subCourts.map(sub => {
          if (sub.id !== booking.subCourtId) return sub;
          const dateSlots = sub.slots[booking.date] || [];
          return {
            ...sub,
            slots: {
              ...sub.slots,
              [booking.date]: dateSlots.map(s => s.time === booking.timeSlot ? { ...s, isBooked: false } : s),
            }
          };
        })
      };
    }));

    if (!booking.customerId || booking.customerId === user.id) {
      setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + booking.price }));
    }

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected' as const } : b));
    setNotifications(prev => [
      {
        id: `notif-rejected-${bookingId}`,
        type: 'booking',
        recipientUserId: booking.customerId,
        ownerId: booking.ownerId,
        venueId: booking.venueId,
        referenceId: bookingId,
        title: 'Booking đã bị từ chối',
        body: `${booking.courtName} - ${booking.subCourtName}, ${booking.timeSlot} ngày ${booking.date} đã bị từ chối và hoàn tiền.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const autoConfirmBookings = () => {
    const pendingIds = bookings.filter(b => b.status === 'pending').map(b => b.id);
    if (pendingIds.length === 0) return;

    setBookings(prev => prev.map(b => pendingIds.includes(b.id) ? { ...b, status: 'confirmed' as const } : b));
    setNotifications(prev => [
      {
        id: `notif-auto-confirm-${Date.now()}`,
        type: 'booking',
        referenceId: pendingIds.join(','),
        title: 'Auto-confirm đã xử lý booking',
        body: `${pendingIds.length} booking pending đã được xác nhận tự động.`,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const updateSlotAvailability = (courtId: string, subCourtId: string, date: string, slotId: string, available: boolean) => {
    setCourts(prevCourts => prevCourts.map(c => {
      if (c.id !== courtId) return c;
      return {
        ...c,
        subCourts: c.subCourts.map(sub => {
          if (sub.id !== subCourtId) return sub;
          const dateSlots = sub.slots[date] || [];
          return {
            ...sub,
            slots: {
              ...sub.slots,
              [date]: dateSlots.map(s => s.id === slotId ? { ...s, isBlocked: !available, isBooked: available ? false : true } : s),
            }
          };
        })
      };
    }));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const submitVenueRequest = (request: Omit<VenueRequest, 'id' | 'ownerId' | 'ownerName' | 'ownerEmail' | 'ownerPhone' | 'status' | 'createdAt' | 'reviewedAt' | 'rejectionReason'>) => {
    const nextRequest: VenueRequest = {
      ...request,
      id: `venue-request-${Date.now()}`,
      ownerId: user.id,
      ownerName: user.name,
      ownerEmail: user.email,
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

    if (user.walletBalance < match.pricePerPlayer) {
      return { success: false, error: 'Số dư ví không đủ để tham gia ghép cặp có phí.' };
    }

    // Deduct
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance - match.pricePerPlayer }));

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

    return { success: true };
  };

  const leaveMatchID = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const isParticipant = match.players.some(p => p.id === user.id);
    if (!isParticipant) return;

    // Refund
    setUser(prev => ({ ...prev, walletBalance: prev.walletBalance + match.pricePerPlayer }));

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
    return newMatch;
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUser(prev => normalizeUserProfile({
      ...prev,
      ...profile,
      skillLevels: {
        ...prev.skillLevels,
        ...(profile.skillLevels || {}),
      },
    }));
  };

  const loginUser = (username: string, password: string): { success: boolean; error?: string; role?: UserRole } => {
    const demoUser = DEMO_USERS.find(
      u => (u.username === username || u.profile.phone === username || u.profile.email === username) && u.password === password
    );
    if (!demoUser) {
      return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không đúng!' };
    }
    setUser(normalizeUserProfile({ ...demoUser.profile }));
    return { success: true, role: demoUser.role };
  };

  const logoutUser = () => {
    localStorage.removeItem('sportres_user');
    setUser(normalizeUserProfile(INITIAL_USER));
  };

  const completeBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'completed' as const } : b));
  };

  const refreshAllData = () => {
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
    // Restart courts
    const freshCourts = INITIAL_COURTS_DATA.map(court => {
      const updatedSubCourts = court.subCourts.map(sub => {
        const slotsMap: { [date: string]: TimeSlot[] } = {};
        DATES_POOL.forEach(date => {
          slotsMap[date] = generateSlotsForDay(court.sport);
        });
        return { ...sub, slots: slotsMap };
      });
      return withCourtOwnership({ ...court, subCourts: updatedSubCourts });
    });
    setCourts(freshCourts);
    setBookings([]);
    setMatches(INITIAL_MATCHES);
    setTournaments(INITIAL_TOURNAMENTS);
    setNotifications([]);
    setVenueRequests([]);
    setFriends(INITIAL_FRIENDS);
    setPrivateChats(INITIAL_PRIVATE_CHATS);
    setFriendRequests(INITIAL_FRIEND_REQUESTS);
  };

  return (
    <SportContext.Provider value={{
      user,
      courts,
      bookings,
      matches,
      tournaments,
      notifications,
      venueRequests,
      leaderboards,
      demoUsers: DEMO_USERS,
      friends,
      privateChats,
      friendRequests,
      selectedDate,
      setSelectedDate,
      depositWallet,
      createBooking,
      cancelBooking,
      acceptBooking,
      rejectBooking,
      autoConfirmBookings,
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
      loginUser,
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
