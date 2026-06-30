import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { Match, SportType } from '../types';
import { 
  Plus, 
  Users, 
  MapPin, 
  DollarSign, 
  Dumbbell, 
  ShieldAlert, 
  Sparkles, 
  ChevronDown, 
  CheckCircle, 
  Search, 
  SlidersHorizontal, 
  Clock, 
  Trophy, 
  ClipboardList, 
  Calendar, 
  Star,
  ArrowLeft,
  Share2,
  UserPlus,
  CheckCircle2,
  Check
} from 'lucide-react';

import { PublicProfileModal } from './PublicProfileModal';
import { SafeImage, getFallbackImage } from './SafeImage';

const formatVietnameseCurrency = (value: number) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const getCurrentPlayers = (match: Match) => match.players.length;
const getRemainingPlayers = (match: Match) => Math.max(0, match.maxPlayers - getCurrentPlayers(match));
const formatRemainingPlayers = (remainingPlayers: number) =>
  remainingPlayers > 0 ? `Còn ${remainingPlayers} người` : 'Đã đủ người';

export const MatchmakingTab: React.FC = () => {
  const { matches, joinMatchID, leaveMatchID, courts, createMatch, user, bookings, selectedMatchId: contextMatchId, setSelectedMatchId: setContextMatchId } = useSport();
  const userBookings = bookings.filter(b => !b.customerId || b.customerId === user.id);
  const confirmedUserBookings = userBookings.filter(booking => booking.status === 'confirmed');
  
  // Custom Filters & Search States
  const [sportFilter, setSportFilter] = useState<'all' | SportType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom styled dropdown filters states
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  
  // Open dropdown manager
  const [openDropdown, setOpenDropdown] = useState<'none' | 'district' | 'time' | 'level'>('none');
  
  // Mode to toggle "My matches"
  const [showOnlyMyMatches, setShowOnlyMyMatches] = useState(false);

  // Matchmaking Host Form State
  const [showHostModal, setShowHostModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [hostTitle, setHostTitle] = useState('');
  const [hostBookingId, setHostBookingId] = useState('');
  const [hostSport, setHostSport] = useState<SportType>('soccer');
  const [hostCourtId, setHostCourtId] = useState('');
  const [hostDate, setHostDate] = useState('Hôm nay');
  const [hostTime, setHostTime] = useState('18:00 - 20:00');
  const [hostLevel, setHostLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Pro'>('Intermediate');
  const [hostMaxPlayers, setHostMaxPlayers] = useState(10);
  const [hostPrice, setHostPrice] = useState(50000);
  const [hostDesc, setHostDesc] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<{ id: string; name: string; avatar: string }[]>([]);

  const friendsPool = [
    { id: 'f1', name: 'Nguyễn Văn An', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 'f2', name: 'Lê Thị Mai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 'f3', name: 'Trần Minh Quân', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 'f4', name: 'Hoàng Thu Hà', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  ];


  // Selected match detail state (Separate Page)
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  // Handle cross-tab selection from Home
  React.useEffect(() => {
    if (contextMatchId) {
      setSelectedMatchId(contextMatchId);
      setContextMatchId(null); // Reset after consumption
    }
  }, [contextMatchId, setContextMatchId]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [viewingPlayer, setViewingPlayer] = useState<{ id: string; name: string; avatar: string; skill?: string } | null>(null);

  // Success Notification toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const datesPool = ['Hôm nay', 'Ngày mai', 'Thứ Bảy', 'Chủ nhật', 'Thứ Hai'];

  // Advanced Filter Logic
  const filteredMatches = matches.filter(m => {
    // Sport category pill filter
    const matchesSport = sportFilter === 'all' || m.sport === sportFilter;

    // Search query filter: match title, court name, address or level
    const matchesSearch = searchQuery === '' || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.address.toLowerCase().includes(searchQuery.toLowerCase());

    // District dropdown filter
    const matchesDistrict = districtFilter === 'all' || 
      m.address.toLowerCase().includes(districtFilter.toLowerCase());

    // Time/Date dropdown filter
    let matchesTime = true;
    if (timeFilter !== 'all') {
      if (timeFilter === 'today') {
        matchesTime = m.date === 'Hôm nay';
      } else if (timeFilter === 'tomorrow') {
        matchesTime = m.date === 'Ngày mai';
      } else if (timeFilter === 'sunday') {
        matchesTime = m.date === 'Chủ nhật';
      }
    }

    // Level dropdown filter
    const matchesLevel = levelFilter === 'all' || m.level === levelFilter;

    // My Matches filter toggle
    const matchesMyFilter = !showOnlyMyMatches || 
      m.creatorId === user.id || 
      m.players.some(p => p.id === user.id);

    return matchesSport && matchesSearch && matchesDistrict && matchesTime && matchesLevel && matchesMyFilter;
  });

  const handleJoin = (matchId: string) => {
    const res = joinMatchID(matchId);
    if (res.success) {
      setToastMsg('Tuyệt vời! Bạn đã đăng ký và ký quỹ tham gia kèo đấu.');
      setTimeout(() => setToastMsg(null), 3000);
    } else {
      setErrorMsg(res.error || 'Tham gia thất bại.');
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleLeave = (matchId: string) => {
    leaveMatchID(matchId);
    setToastMsg('Đã rút khỏi kèo đấu thành công. Bạn được hoàn tiền 100% lệ phí.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostTitle.trim() || !hostBookingId) {
      setErrorMsg('Vui lòng điền đầy đủ các mục bắt buộc nhé.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    const courtObj = courts.find(c => c.id === hostCourtId);
    if (!courtObj) return;

    createMatch({
      bookingId: hostBookingId,
      title: hostTitle,
      sport: hostSport,
      courtId: hostCourtId,
      courtName: courtObj.name,
      address: courtObj.district + ', HN',
      date: hostDate,
      time: hostTime,
      level: hostLevel,
      maxPlayers: hostMaxPlayers,
      pricePerPlayer: hostPrice,
      description: hostDesc || `Giao lưu thể thao ${sportFilter === 'all' ? 'vui vẻ' : sportFilter} cùng anh em cực năng động.`
    });

    setShowHostModal(false);
    // Reset form
    setHostTitle('');
    setHostDesc('');
    setToastMsg('Đăng kèo thành công! Hệ thống đang phát tín hiệu tới người chơi xung quanh...');
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Convert English Sport Keys to Vietnamese badges matching design instructions
  const getSportVNBadge = (sport: string) => {
    switch (sport) {
      case 'soccer':
        return 'BÓNG ĐÁ SÂN 7';
      case 'badminton':
        return 'CẦU LÔNG ĐÔI';
      case 'pickleball':
        return 'PICKLEBALL';
      case 'tennis':
        return 'TENNIS ĐƠN';
      case 'basketball':
        return 'BÓNG RỔ';
      default:
        return 'THỂ THAO GIAO LƯU';
    }
  };

  // Convert English levels to match Vietnamese levels
  const getLevelVNBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'MỚI CHƠI';
      case 'Intermediate':
        return 'TRUNG BÌNH';
      case 'Advanced':
        return 'KHÁ';
      case 'Pro':
        return 'CHUYÊN NGHIỆP';
      default:
        return 'TRUNG BÌNH';
    }
  };

  const formatJoinTime = (joinedAt?: string) => {
    if (!joinedAt) return 'Chưa có thời gian';
    return new Date(joinedAt).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Dynamic cover image based on Sport category
  const getMatchCoverImage = (sport: string) => {
    switch (sport) {
      case 'soccer':
        return getFallbackImage('soccer');
      case 'badminton':
        return getFallbackImage('badminton');
      case 'pickleball':
        return getFallbackImage('pickleball');
      case 'tennis':
        return getFallbackImage('tennis');
      case 'basketball':
        return getFallbackImage('basketball');
      default:
        return getFallbackImage();
    }
  };

  // SHARE TOAST ACTION
  const triggerShareAction = (matchTitle: string) => {
    setToastMsg(`Đã sao chép liên kết trận đấu để chia sẻ!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Compatibility score helper
  const renderCompatibility = (match: Match) => {
    const userSkill = user.skillLevels[match.sport] || 'Intermediate';
    const isCompatible = userSkill === match.level;
    
    if (isCompatible) {
      return (
        <span className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-600 bg-emerald-55 px-2.5 py-0.5 rounded-full select-none">
          <Sparkles size={8} /> Hợp trình độ!
        </span>
      );
    }
    return null;
  };

  // Lookup the selected match if we are in Detail Mode
  const selectedMatch = matches.find(m => m.id === selectedMatchId);

  // IF RENDERING DETAIL LEVEL PAGE
  if (selectedMatchId && selectedMatch) {
    const isJoined = selectedMatch.players.some(p => p.id === user.id);
    const isCreator = selectedMatch.creatorId === user.id;
    const currentPlayers = getCurrentPlayers(selectedMatch);
    const remainingPlayers = getRemainingPlayers(selectedMatch);

    return (
      <div id="match-detail-page-container" className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FB] select-none animate-fadeIn relative">
        
        {/* Detail page Toast Alert popups */}
        {toastMsg && (
          <div id="detail-quick-toast-msg" className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-neutral-900 text-emerald-400 p-3 rounded-2xl shadow-2xl text-xs font-bold text-center z-50 transition-all border border-emerald-500">
            🎉 {toastMsg}
          </div>
        )}

        {errorMsg && (
          <div id="detail-quick-error-msg" className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-red-600 text-white p-3 rounded-2xl shadow-2xl text-xs font-bold text-center z-50 transition-all">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* 1. HEADER (CHI TIẾT TRẬN ĐẤU) */}
        <div className="bg-white px-4 py-3 shrink-0 flex items-center justify-between border-b border-neutral-100 shadow-3xs relative z-10">
          <button
            onClick={() => setSelectedMatchId(null)}
            className="p-1 text-neutral-600 hover:text-neutral-900 transition bg-neutral-50 rounded-xl hover:bg-neutral-100 cursor-pointer"
            id="detail-back-button"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h2 className="text-[13px] font-black text-neutral-800 uppercase tracking-wider text-center">
            Chi tiết trận đấu
          </h2>

          <button
            onClick={() => triggerShareAction(selectedMatch.title)}
            className="p-1 text-neutral-600 hover:text-emerald-500 transition bg-neutral-50 rounded-xl hover:bg-neutral-100 cursor-pointer"
            id="detail-share-button"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* 2. MAIN SCROLLABLE CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
          
          {/* Sports cover graphic banner image */}
          <div className="w-full h-44 rounded-[28px] overflow-hidden shadow-xs relative bg-neutral-100">
            <SafeImage 
              src={getMatchCoverImage(selectedMatch.sport)} 
              fallbackSrc={getFallbackImage(selectedMatch.sport)}
              sportType={selectedMatch.sport}
              alt={selectedMatch.title}
              className="w-full h-full object-cover"
            />
            {/* Visual gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
          </div>

          {/* Badge Indicators Segment */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-[#EFF6FF] text-[#1E40AF] text-[9px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              {getSportVNBadge(selectedMatch.sport)}
            </span>
            <span className="bg-[#FFF7ED] text-[#9A3412] text-[9px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              CẤP ĐỘ: {getLevelVNBadge(selectedMatch.level)}
            </span>
            {renderCompatibility(selectedMatch)}
          </div>

          {/* Bold Match Title headings text */}
          <h1 className="text-base font-black text-neutral-900 tracking-tight leading-tight text-left">
            {selectedMatch.title}
          </h1>

          {/* Timing and location details container panel */}
          <div className="bg-white rounded-[24px] border border-neutral-100 p-4 space-y-4 shadow-3xs text-left">
            
            {/* Row 1: Clock Time */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest block">
                  THỜI GIAN
                </span>
                <p className="text-xs text-neutral-800 font-black mt-0.5 leading-snug">
                  {selectedMatch.date}, {selectedMatch.time}
                </p>
              </div>
            </div>

            {/* Row 2: Location Map */}
            <div className="flex items-start gap-3.5 border-t border-neutral-50 pt-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center shrink-0">
                <MapPin size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest block">
                  ĐỊA ĐIỂM
                </span>
                <p className="text-xs text-neutral-800 font-black mt-0.5 leading-snug truncate">
                  {selectedMatch.courtName}
                </p>
                <p className="text-[10px] text-neutral-400 font-bold mt-0.5 truncate">
                  {selectedMatch.address}
                </p>
              </div>
            </div>
          </div>

          {/* "Người tổ chức" card widget design template visual */}
          <div className="text-left space-y-2">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">
              Người tổ chức
            </h3>
            
            <div className="bg-white rounded-3xl border border-neutral-100 p-3 flex items-center justify-between shadow-3xs">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  const creator = selectedMatch.players.find(p => p.id === selectedMatch.creatorId) || { id: selectedMatch.creatorId, name: selectedMatch.creatorName, avatar: selectedMatch.creatorAvatar };
                  setViewingPlayer(creator);
                }}
              >
                <SafeImage 
                  src={selectedMatch.creatorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                  fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                  alt={selectedMatch.creatorName}
                  className="w-11 h-11 rounded-full object-cover border border-neutral-100 shadow-3xs group-hover:scale-105 transition"
                />
                <div className="group-hover:translate-x-1 transition">
                  <h4 className="text-xs font-black text-neutral-800 leading-none group-hover:text-emerald-600 transition">
                    {selectedMatch.creatorName}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[9px] text-blue-600 font-extrabold uppercase mt-1">
                    <CheckCircle2 size={10} className="fill-blue-600 text-white" /> Thành viên uy tín
                  </span>
                </div>
              </div>

              {/* Messaging feature temporarily hidden until future development. */}
            </div>
          </div>

          {/* "Người tham gia" component widget section */}
          <div className="text-left space-y-2">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Người tham gia ({currentPlayers}/{selectedMatch.maxPlayers})
              </h3>
              
              <button 
                onClick={() => setShowParticipantsModal(true)} 
                className="text-[10.5px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            {/* Overlapping pristine stacked circles containing players */}
            <div className="flex items-center gap-2 bg-white rounded-3xl border border-neutral-100 p-3 shadow-3xs">
              <div className="flex -space-x-2.5 overflow-hidden">
                {selectedMatch.players.map((p, idx) => (
                  <SafeImage
                    key={p.id}
                    src={p.avatar}
                    fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                    alt={p.name}
                    title={`${p.name} - Trình: ${p.skill || 'Khá'}`}
                    onClick={() => setViewingPlayer(p)}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-3xs cursor-pointer hover:scale-110 transition-transform"
                  />
                ))}
                
                {/* Empty green circle design decoration segments representing remaining slots */}
                {Array.from({ length: Math.min(3, remainingPlayers) }).map((_, idx) => (
                  <div 
                    key={`empty-${idx}`} 
                    className="h-8 w-8 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-300 flex items-center justify-center text-emerald-500 font-black text-[12px] ring-2 ring-white select-none shadow-3xs"
                    title="Slot trống đang chờ"
                  >
                    +
                  </div>
                ))}
              </div>

              {remainingPlayers > 3 && (
                <span className="text-[10px] text-neutral-400 font-extrabold ml-1 uppercase">
                  +{remainingPlayers - 3} slot trống
                </span>
              )}

              {remainingPlayers === 0 && (
                <span className="text-[10px] text-emerald-600 font-black ml-1 uppercase">
                  Đã đủ người
                </span>
              )}
            </div>
          </div>

          {/* "Mô tả & Lưu ý" text description section layout widget */}
          <div className="text-left space-y-2">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">
              Mô tả &amp; Lưu ý
            </h3>
            
            <p className="bg-white rounded-3xl border border-neutral-100 p-4 shadow-3xs text-[11px] text-neutral-600 font-semibold leading-relaxed">
              {selectedMatch.description || "Trận đấu giao lưu vui vẻ cọ xát nâng cao trình độ, yêu cầu người tham gia có mặt trước 15 phút để chuẩn bị khởi động. Chia tiền sân đều cho tất cả mọi người. Vui lòng giữ gìn vệ sinh chung sân tập."}
            </p>
          </div>
        </div>

        {/* 3. FIXED BOTTOM BAR ACTIONS FEE BLOCK */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 shadow-2xl flex items-center justify-between z-10">
          <div className="text-left">
            <span className="text-[9px] text-[#94A3B8] font-black uppercase tracking-wider block">
              PHÍ THAM GIA
            </span>
            <p className="text-[15px] font-black text-neutral-800 leading-none mt-1">
              {selectedMatch.pricePerPlayer === 0 ? 'Miễn phí' : formatVietnameseCurrency(selectedMatch.pricePerPlayer)}
            </p>
          </div>

          {isCreator ? (
            <div className="bg-neutral-100 text-neutral-500 font-extrabold px-6 py-2.5 rounded-2xl text-[11.5px] text-center">
              Kèo của bạn
            </div>
          ) : isJoined ? (
            <button
              onClick={() => handleLeave(selectedMatch.id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/40 font-black px-6 py-2.5 rounded-2xl text-[11.5px] transition cursor-pointer active:scale-95"
            >
              Hủy tham gia kèo
            </button>
          ) : (
            <button
              onClick={() => handleJoin(selectedMatch.id)}
              disabled={remainingPlayers === 0}
              className={`flex items-center gap-1.5 font-black px-7 py-2.5 rounded-2xl text-[11.5px] transition cursor-pointer active:scale-95 text-white ${
                remainingPlayers === 0
                  ? 'bg-neutral-300 cursor-not-allowed'
                  : 'bg-[#10B981] hover:bg-emerald-600 shadow-md'
              }`}
            >
              <UserPlus size={14} strokeWidth={2.5} /> {remainingPlayers === 0 ? 'Đã đủ người' : 'Tham gia ngay'}
            </button>
          )}
        </div>

        {/* 4. MODAL DETAILED PARTICIPANTS VIEW SCREEN */}
        {showParticipantsModal && (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-[28px] w-full max-w-sm p-4 shadow-2xl border border-neutral-100 space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-black text-neutral-800 uppercase flex items-center gap-1">
                  👥 Danh sách tham gia ({currentPlayers}/{selectedMatch.maxPlayers})
                </h3>
                <button
                  onClick={() => setShowParticipantsModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {selectedMatch.players.map((p) => (
                  <div key={p.id} onClick={() => setViewingPlayer(p)} className="flex items-center bg-neutral-50 p-2.5 rounded-2xl hover:bg-neutral-100 transition justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <SafeImage src={p.avatar} alt={p.name} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" className="w-8 h-8 rounded-full object-cover" />
                      <div className="text-left">
                        <p className="text-xs font-black text-neutral-800">{p.name}</p>
                        <span className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 block">
                          {getSportVNBadge(p.sport || selectedMatch.sport)} • {p.skill || selectedMatch.level}
                        </span>
                        <span className="text-[8.5px] text-neutral-400 font-semibold mt-0.5 block">
                          {(p.status || 'joined') === 'joined' ? 'Đã tham gia' : p.status} • {formatJoinTime(p.joinedAt)}
                        </span>
                      </div>
                    </div>
                    {p.id === selectedMatch.creatorId ? (
                      <span className="text-[8px] bg-amber-500/10 text-amber-600 font-black px-2 py-0.5 rounded-full uppercase">Chủ kèo</span>
                    ) : (
                      <span className="text-[8px] bg-neutral-200 text-neutral-500 font-bold px-2 py-0.5 rounded-full uppercase">Thành viên</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowParticipantsModal(false)}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition cursor-pointer mt-1"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {/* PUBLIC PROFILE MODAL */}
        {viewingPlayer && (
          <PublicProfileModal player={viewingPlayer} onClose={() => setViewingPlayer(null)} />
        )}
      </div>
    );
  }

  // IF RENDERING LIST OF MATCHES (DEFAULT TIM-TRAN-DAU PAGE VIEW)
  return (
    <div id="matchmaking-tab-content" className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FB] select-none animate-fadeIn relative">
      
      {/* Toast Alert popups */}
      {toastMsg && (
        <div id="quick-toast-msg" className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-neutral-900 text-emerald-400 p-3 rounded-2xl shadow-2xl text-xs font-bold text-center z-50 transition-all border border-emerald-500">
          🎉 {toastMsg}
        </div>
      )}

      {errorMsg && (
        <div id="quick-error-msg" className="fixed top-24 left-1/2 -translate-x-1/2 w-80 bg-red-600 text-white p-3 rounded-2xl shadow-2xl text-xs font-bold text-center z-50 transition-all">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* SEARCH AND HEADER SECTION */}
      <div className="bg-white px-4 pt-3 pb-2.5 shrink-0 space-y-3 shadow-xs border-b border-neutral-100">
        
        {/* Title and Active MyMatches Toggle */}
        <div className="flex justify-between items-center relative">
          <div className="w-8"></div> {/* Spacer balance */}
          <h2 className="text-[13px] font-black text-neutral-800 uppercase tracking-widest text-center">
            Tìm trận đấu
          </h2>
          <button
            onClick={() => {
              setShowOnlyMyMatches(!showOnlyMyMatches);
              setToastMsg(showOnlyMyMatches ? 'Hiển thị tất cả kèo đấu' : 'Đang lọc các kèo đấu của bạn');
              setTimeout(() => setToastMsg(null), 2000);
            }}
            className="p-1 text-neutral-600 hover:text-emerald-500 transition relative bg-neutral-50 rounded-lg hover:bg-neutral-100"
            title="Kèo đấu của tôi"
          >
            <ClipboardList size={16} className={showOnlyMyMatches ? 'text-emerald-500' : 'text-neutral-600'} />
            <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${showOnlyMyMatches ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
          </button>
        </div>

        {/* Input Search Block */}
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm sân, khu vực hoặc cấp độ..."
            className="w-full bg-[#EFF2F5] border-2 border-transparent rounded-3xl pl-12 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400/80 font-bold focus:outline-none focus:bg-white focus:border-emerald-500/30 transition"
          />
        </div>

        {/* Categories Strip */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'soccer', label: 'Bóng đá' },
            { id: 'badminton', label: 'Cầu lông' },
            { id: 'pickleball', label: 'Pickleball' },
            { id: 'tennis', label: 'Tennis' },
            { id: 'basketball', label: 'Bóng rổ' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSportFilter(cat.id as any);
                setSelectedMatchId(null);
              }}
              className={`px-4.5 py-1.5 text-[10.5px] font-extrabold rounded-full transition cursor-pointer shrink-0 ${
                sportFilter === cat.id
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'bg-[#EFF2F5] text-neutral-600 hover:bg-[#E5E9ED]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* DROPDOWN FILTER OVERLAYS ROW */}
      <div className="flex gap-2 justify-between items-center px-4 py-2 bg-white border-b border-neutral-100 sticky top-0 z-10 shrink-0">
        
        {/* Area selector */}
        <div className="relative flex-1">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'district' ? 'none' : 'district')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border rounded-xl text-[10px] font-bold text-neutral-700 transition ${
              districtFilter !== 'all' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span className="truncate">
              {districtFilter === 'all' ? 'Khu vực' : `${districtFilter}`}
            </span>
            <ChevronDown size={10} className={`text-neutral-400 transition-transform ${openDropdown === 'district' ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === 'district' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 p-1 space-y-1 animate-fadeIn max-h-48 overflow-y-auto">
              {[
                { value: 'all', label: 'Tất cả khu vực' },
                { value: 'Thạch Thất', label: 'Thạch Thất' },
                { value: 'Quận 5', label: 'Quận 5' },
                { value: 'Quận 10', label: 'Quận 10' },
                { value: 'Hòa Lạc', label: 'Hòa Lạc' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setDistrictFilter(opt.value);
                    setOpenDropdown('none');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    districtFilter === opt.value ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Filter */}
        <div className="relative flex-1">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'time' ? 'none' : 'time')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border rounded-xl text-[10px] font-bold text-neutral-700 transition ${
              timeFilter !== 'all' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span className="truncate">
              {timeFilter === 'all' ? 'Thời gian' : `${timeFilter === 'today' ? 'Hôm nay' : timeFilter === 'tomorrow' ? 'Ngày mai' : 'Chủ nhật'}`}
            </span>
            <ChevronDown size={10} className={`text-neutral-400 transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === 'time' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 p-1 space-y-1 animate-fadeIn">
              {[
                { value: 'all', label: 'Tất cả' },
                { value: 'today', label: 'Hôm nay' },
                { value: 'tomorrow', label: 'Ngày mai' },
                { value: 'sunday', label: 'Chủ nhật' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTimeFilter(opt.value);
                    setOpenDropdown('none');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    timeFilter === opt.value ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Level Selector */}
        <div className="relative flex-1">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'level' ? 'none' : 'level')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 bg-white border rounded-xl text-[10px] font-bold text-neutral-700 transition ${
              levelFilter !== 'all' ? 'border-emerald-500 text-emerald-600 bg-emerald-50/20' : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <span className="truncate">
              {levelFilter === 'all' ? 'Cấp độ' : `Trình: ${levelFilter === 'Beginner' ? 'Mới chơi' : levelFilter === 'Intermediate' ? 'Khá' : levelFilter === 'Advanced' ? 'Cứng' : 'Pro'}`}
            </span>
            <ChevronDown size={10} className={`text-neutral-400 transition-transform ${openDropdown === 'level' ? 'rotate-180' : ''}`} />
          </button>
          
          {openDropdown === 'level' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-100 rounded-2xl shadow-xl z-50 p-1 space-y-1 animate-fadeIn">
              {[
                { value: 'all', label: 'Tất cả cấp độ' },
                { value: 'Beginner', label: 'Mới chơi' },
                { value: 'Intermediate', label: 'Khá' },
                { value: 'Advanced', label: 'Cứng' },
                { value: 'Pro', label: 'Chuyên nghiệp' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setLevelFilter(opt.value);
                    setOpenDropdown('none');
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-[10px] font-bold transition ${
                    levelFilter === opt.value ? 'bg-emerald-50 text-emerald-600' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOATING CLASSIC PLUS ACTION BUTTON */}
      <button
        id="host-match-fab"
        onClick={() => {
          setHostCourtId(courts[0]?.id || '');
          setHostDate('Hôm nay');
          setShowHostModal(true);
        }}
        className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-2xl z-40 cursor-pointer active:scale-95 hover:bg-emerald-600 transition-all border border-emerald-400/35"
        title="Tạo kèo giao hữu mới"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      {/* CORE SCROLLING CONTENT FEEDS LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredMatches.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-neutral-200 mt-6 space-y-2">
            <Users size={32} className="text-neutral-300 mx-auto" />
            <p className="text-xs text-neutral-400 font-bold">Không tìm thấy kèo đấu nào phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSportFilter('all');
                setSearchQuery('');
                setDistrictFilter('all');
                setTimeFilter('all');
                setLevelFilter('all');
                setShowOnlyMyMatches(false);
              }}
              className="text-[10px] text-emerald-600 underline font-extrabold cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          filteredMatches.map(match => {
            const isJoined = match.players.some(p => p.id === user.id);
            const isCreator = match.creatorId === user.id;
            const remainingPlayers = getRemainingPlayers(match);

            return (
              <div
                key={match.id}
                id={`match-card-${match.id}`}
                className="bg-white rounded-3xl shadow-xs border border-neutral-100 overflow-hidden transition-all duration-200 flex flex-col hover:shadow-md cursor-pointer text-left"
                onClick={() => setSelectedMatchId(match.id)}
              >
                {/* Visual Header Grid layout area */}
                <div className="p-3.5 space-y-3 select-none">
                  
                  {/* Top line detail */}
                  <div className="flex justify-between items-start gap-2">
                    
                    {/* Left Icon + Name block */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Smooth greenish card representing the sport */}
                      <div className="w-10 h-10 bg-[#E8F7F2] rounded-2xl flex items-center justify-center shrink-0 shadow-3xs">
                        <span className="text-xl">
                          {match.sport === 'soccer' && '⚽'}
                          {match.sport === 'badminton' && '🏸'}
                          {match.sport === 'pickleball' && '🏓'}
                          {match.sport === 'tennis' && '🎾'}
                          {match.sport === 'basketball' && '🏀'}
                          {match.sport !== 'soccer' && match.sport !== 'badminton' && match.sport !== 'pickleball' && match.sport !== 'tennis' && match.sport !== 'basketball' && '🏆'}
                        </span>
                      </div>
                      
                      <div className="min-w-0 text-left">
                        <h4 className="text-neutral-900 text-xs md:text-sm font-extrabold tracking-tight leading-snug truncate">
                          {match.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 mt-0.5 font-bold">
                          <MapPin size={10} className="text-neutral-400 shrink-0" />
                          <span className="truncate">{match.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right peach remaining players badge */}
                    <div className="bg-[#FFF2E6] border border-orange-100/10 px-2.5 py-0.5 rounded-lg shrink-0 select-none">
                      <span className="text-[9px] font-black tracking-wider text-[#FF7A00] block uppercase">
                        {formatRemainingPlayers(remainingPlayers)}
                      </span>
                    </div>
                  </div>

                  {/* Middle row details block: time and level with nice green icons */}
                  <div className="grid grid-cols-2 gap-2 text-[10.5px] text-neutral-700 bg-neutral-50/55 p-2 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-left">
                      <Clock size={12} className="text-[#10B981] shrink-0" />
                      <span className="font-extrabold text-neutral-700">{match.time} - {match.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-left">
                      <Trophy size={12} className="text-[#10B981] shrink-0" />
                      <span className="font-extrabold text-[#334155]">
                        Cấp độ: {
                          match.level === 'Beginner' ? 'Mới chơi' : 
                          match.level === 'Intermediate' ? 'Khá' : 
                          match.level === 'Advanced' ? 'Cứng' : 'Chuyên nghiệp'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Bottom inline: Stack of players and Action button */}
                  <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-neutral-100 select-none">
                    
                    {/* Overlapping small avatar loop */}
                    <div className="flex items-center">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {match.players.slice(0, 3).map((player) => (
                          <SafeImage
                            key={player.id}
                            src={player.avatar}
                            fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                            alt={player.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingPlayer(player);
                            }}
                            className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-white object-cover cursor-pointer hover:scale-110 transition-transform"
                          />
                        ))}
                      </div>
                      {match.players.length > 3 && (
                        <span className="flex items-center justify-center text-[9px] font-black text-neutral-500 bg-[#EFF2F5] ring-2 ring-white rounded-full px-1.5 h-6.5 min-w-[26px] ml-1 select-none">
                          +{match.players.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Join / Leave button directly on outer card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Access detail view when tapping card body, but allow quick action!
                        if (isCreator) {
                          setSelectedMatchId(match.id);
                        } else if (isJoined) {
                          handleLeave(match.id);
                        } else {
                          handleJoin(match.id);
                        }
                      }}
                      disabled={remainingPlayers === 0 && !isJoined}
                      className={`px-5 py-2 rounded-full text-[11px] font-black transition cursor-pointer select-none active:scale-95 shadow-2xs ${
                        isCreator
                          ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                          : isJoined
                          ? 'bg-neutral-150 hover:bg-neutral-200 text-neutral-600'
                          : remainingPlayers === 0
                          ? 'bg-[#EFF2F5] text-neutral-400 cursor-not-allowed'
                          : 'bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold'
                      }`}
                    >
                      {isCreator ? 'Kèo của bạn' : isJoined ? 'Đã tham gia' : remainingPlayers === 0 ? 'Đã đủ người' : 'Tham gia'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* HOST MATCHMAKING EVENT FORM MODAL DECOR */}
      {showHostModal && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <form
            onSubmit={handleHostSubmit}
            className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl border border-neutral-100 space-y-3.5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="text-xs font-black text-neutral-800 uppercase flex items-center gap-1 text-left">
                🏆 Đăng kèo giao đối kháng
              </h3>
              <button
                type="button"
                onClick={() => setShowHostModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-left">
              {/* Match Title */}
              <div>
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">Tiêu đề kèo đấu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Cần 2 tiền đạo cứng đá phủi"
                  value={hostTitle}
                  onChange={e => setHostTitle(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-emerald-500 mt-1"
                />
              </div>

              {/* Sport and difficulty level Selection */}
              <div className="grid grid-cols-2 gap-2 font-sans">
                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Bộ môn *</label>
                  <select
                    value={hostSport}
                    onChange={e => setHostSport(e.target.value as SportType)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs focus:outline-emerald-500 mt-1 font-semibold"
                  >
                    <option value="soccer">Bóng đá</option>
                    <option value="badminton">Cầu lông</option>
                    <option value="pickleball">Pickleball</option>
                    <option value="tennis">Tennis</option>
                    <option value="basketball">Bóng rổ</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Trình độ tối thiểu *</label>
                  <select
                    value={hostLevel}
                    onChange={e => setHostLevel(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs focus:outline-emerald-500 mt-1 font-semibold"
                  >
                    <option value="Beginner">Mới chơi (Beginner)</option>
                    <option value="Intermediate">Khá (Intermediate)</option>
                    <option value="Advanced">Cứng (Advanced)</option>
                    <option value="Pro">Chuyên nghiệp (Pro)</option>
                  </select>
                </div>
              </div>

              {/* Tournament Stadium Organizer */}
              <div>
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Sân đã đặt (Chưa hoàn thành) *</label>
                <select
                  required
                  value={hostBookingId}
                  onChange={e => {
                    const bId = e.target.value;
                    setHostBookingId(bId);
                    const booking = confirmedUserBookings.find(b => b.id === bId);
                    if (booking) {
                      setHostCourtId(booking.courtId);
                      setHostDate(booking.date);
                      setHostTime(booking.timeSlot);
                      setHostSport(booking.sport);
                      setHostPrice(Math.round(booking.price / hostMaxPlayers));
                    }
                  }}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-2 text-xs focus:outline-emerald-500 mt-1 font-semibold"
                >
                  <option value="" disabled>-- Chọn một sân đã đặt --</option>
                  {confirmedUserBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      [{b.sport.toUpperCase()}] {b.courtName} - {b.subCourtName} ({b.date} {b.timeSlot})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date / Hours Input details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Ngày thi đấu *</label>
                  <input
                    type="text"
                    disabled
                    value={hostDate}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-500 mt-1 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Giờ thi đấu *</label>
                  <input
                    type="text"
                    disabled
                    value={hostTime}
                    className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-500 mt-1 font-semibold"
                  />
                </div>
              </div>

              {/* Player limit and split pricing details */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block flex items-center justify-between">
                    <span>Số người tối đa *</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={2}
                    max={40}
                    value={hostMaxPlayers}
                    onChange={e => setHostMaxPlayers(parseInt(e.target.value) || 4)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-emerald-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Lệ phí mỗi người *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={5000}
                    value={hostPrice}
                    onChange={e => setHostPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-emerald-500 mt-1"
                  />
                </div>
              </div>

              {/* Invite Friends */}
              <div>
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">Mời bạn bè tham gia kèo</label>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(true)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 transition"
                  >
                    <span className="text-xl">+</span>
                  </button>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {invitedFriends.map(friend => (
                      <div key={friend.id} className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 rounded-full border bg-emerald-50 border-emerald-500 text-emerald-700 text-[10px] font-bold">
                        <SafeImage src={friend.avatar} alt={friend.name} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" className="w-4 h-4 rounded-full object-cover" />
                        <span>{friend.name.split(' ').pop()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invite Modal */}
              {showInviteModal && (
                <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-60 p-4 animate-fadeIn">
                  <div className="bg-white rounded-3xl w-full max-w-sm p-4 shadow-2xl border border-neutral-100 space-y-3 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                      <h3 className="text-sm font-black text-neutral-800">Chọn bạn bè</h3>
                      <button onClick={() => setShowInviteModal(false)} className="text-neutral-400 font-bold">✕</button>
                    </div>
                    <div className="space-y-2">
                      {friendsPool.map(friend => {
                        const isInvited = invitedFriends.some(f => f.id === friend.id);
                        return (
                          <button
                            key={friend.id}
                            type="button"
                            onClick={() => {
                              if (isInvited) setInvitedFriends(prev => prev.filter(f => f.id !== friend.id));
                              else setInvitedFriends(prev => [...prev, friend]);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl transition ${isInvited ? 'bg-emerald-50' : 'hover:bg-neutral-50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <SafeImage src={friend.avatar} alt={friend.name} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" className="w-8 h-8 rounded-full object-cover"/>
                              <span className="text-xs font-bold text-neutral-800">{friend.name}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isInvited ? 'bg-emerald-500 border-emerald-500' : 'border-neutral-300'}`}>
                              {isInvited && <span className="text-white text-xs">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setShowInviteModal(false)}
                      className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold mt-2"
                    >
                      Xong
                    </button>
                  </div>
                </div>
              )}

              {/* Message from owner */}
              <div>
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-sans">Lời nhắn gửi mọi người</label>
                <textarea
                  placeholder="Ví dụ: Kèo vui vẻ cọ xát nhiệt tình, chia đều đóng tiền..."
                  rows={2}
                  value={hostDesc}
                  onChange={e => setHostDesc(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-800 focus:outline-emerald-500 mt-1 resize-none"
                />
              </div>
            </div>

            <p className="text-[8px] text-neutral-400 text-center leading-normal">
              * Hệ thống SportRes sẽ gửi thông báo đẩy đến tất cả người dùng trong khu vực có trình độ thỏa mãn yêu cầu của bạn.
            </p>

            <div className="flex gap-2 pt-1 font-sans">
              <button
                type="button"
                onClick={() => setShowHostModal(false)}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
              >
                Đăng kèo đấu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PUBLIC PROFILE MODAL */}
      {viewingPlayer && (
        <PublicProfileModal player={viewingPlayer} onClose={() => setViewingPlayer(null)} />
      )}
    </div>
  );
};
