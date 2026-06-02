import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { 
  User, 
  Wallet, 
  Sparkles, 
  LogOut, 
  ChevronRight, 
  Calendar, 
  ShieldCheck, 
  Info, 
  MapPin, 
  Settings, 
  Check, 
  X, 
  Clock, 
  Activity,
  UserCheck,
  Trophy,
  Star,
  UserPlus,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Booking, Match, SportType, UserProfile } from '../types';
import { SafeImage } from './SafeImage';

type SkillLevel = UserProfile['skillLevels'][SportType];

const ACTIVE_SPORTS: SportType[] = ['soccer', 'badminton', 'tennis', 'pickleball', 'basketball', 'volleyball', 'golf'];
const SKILL_OPTIONS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

export const ProfileTab: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { user, depositWallet, bookings, matches, cancelBooking, updateUserProfile, completeBooking, logoutUser } = useSport();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // States to control beautiful detail modals
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeScheduleTab, setActiveScheduleTab] = useState<'bookings' | 'matches'>('bookings');

  // Post-match evaluation states
  const [activeRatingBooking, setActiveRatingBooking] = useState<any | null>(null);
  const [courtRating, setCourtRating] = useState(0);
  const [membersToRate, setMembersToRate] = useState([
    { id: 'm1', name: 'Nguyễn Văn An', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', rating: 0, added: false },
    { id: 'm2', name: 'Lê Thị Mai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', rating: 0, added: false },
    { id: 'm3', name: 'Trần Minh Quân', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rating: 0, added: false },
    { id: 'm4', name: 'Hoàng Thu Hà', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', rating: 0, added: false },
  ]);

  const getBookingStatusMeta = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Chờ duyệt', className: 'bg-amber-50 text-amber-600' };
      case 'confirmed':
        return { label: 'Đã đặt', className: 'bg-emerald-50 text-emerald-600' };
      case 'completed':
        return { label: 'Hoàn thành', className: 'bg-blue-50 text-blue-600' };
      case 'rejected':
        return { label: 'Bị từ chối', className: 'bg-red-50 text-red-500' };
      default:
        return { label: 'Đã hủy', className: 'bg-red-50 text-red-500' };
    }
  };

  const getMatchStatusMeta = (status: Match['status']) => {
    switch (status) {
      case 'open':
        return { label: 'Đang tuyển người', className: 'bg-emerald-50 text-emerald-600' };
      case 'full':
        return { label: 'Đã đủ người', className: 'bg-blue-50 text-blue-600' };
      case 'finished':
        return { label: 'Hoàn thành', className: 'bg-neutral-100 text-neutral-500' };
      default:
        return { label: 'Sắp diễn ra', className: 'bg-amber-50 text-amber-600' };
    }
  };

  const startEvaluation = (b: Booking) => {
    setCourtRating(0);
    setMembersToRate([
      { id: 'm1', name: 'Nguyễn Văn An', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', rating: 0, added: false },
      { id: 'm2', name: 'Lê Thị Mai', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', rating: 0, added: false },
      { id: 'm3', name: 'Trần Minh Quân', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', rating: 0, added: false },
      { id: 'm4', name: 'Hoàng Thu Hà', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', rating: 0, added: false },
    ]);
    setActiveRatingBooking(b);
    setShowBookingsModal(false);
  };

  const handleRateMember = (memberId: string, rating: number) => {
    setMembersToRate(prev => prev.map(m => m.id === memberId ? { ...m, rating } : m));
  };

  const handleToggleFriend = (memberId: string) => {
    setMembersToRate(prev => {
      return prev.map(m => {
        if (m.id === memberId) {
          const newAdded = !m.added;
          if (newAdded) {
            triggerToast(`Đã gửi kết bạn đến ${m.name}!`);
          }
          return { ...m, added: newAdded };
        }
        return m;
      });
    });
  };

  // Profile Edit fields states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editGender, setEditGender] = useState(user.gender || 'Nam');
  const [editArea, setEditArea] = useState(user.activeArea || 'Thạch Thất, Hà Nội');
  const [editSports, setEditSports] = useState<SportType[]>(user.favoriteSports || []);
  const [editSkillLevels, setEditSkillLevels] = useState<UserProfile['skillLevels']>(user.skillLevels);

  // Settings mock toggle states
  const [settingsPush, setSettingsPush] = useState(true);
  const [settingsSound, setSettingsSound] = useState(true);
  const [settingsAutoPay, setSettingsAutoPay] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 3000);
  };

  const sportLabels: Record<SportType, string> = {
    soccer: '⚽ Bóng đá',
    badminton: '🏸 Cầu lông',
    tennis: '🎾 Quần vợt',
    basketball: '🏀 Bóng rổ',
    pickleball: '🏓 Pickleball',
    volleyball: '🏐 Bóng chuyền',
    golf: '⛳ Golf',
    all: '🏟️ Đa năng',
  };

  const toggleEditSport = (sport: SportType) => {
    setEditSports(prev => {
      if (prev.includes(sport)) {
        return prev.filter(item => item !== sport);
      }
      return [...prev, sport];
    });
    setEditSkillLevels(prev => ({
      ...prev,
      [sport]: prev[sport] || 'Beginner',
    }));
  };

  const setEditSportSkill = (sport: SportType, skill: SkillLevel) => {
    setEditSkillLevels(prev => ({
      ...prev,
      [sport]: skill,
    }));
  };

  // Convert default or saved date strings to Vietnamese format
  const formatVNStyleDate = (dateStr: string) => {
    try {
      if (dateStr === 'Hôm nay' || dateStr === 'Ngày mai') return dateStr;
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const userBookings = bookings.filter(b => !b.customerId || b.customerId === user.id);
  const userMatches = matches.filter(match => match.creatorId === user.id || match.players.some(player => player.id === user.id));
  const isAnyModalOpen = isEditing || showBookingsModal || showSettingsModal || showVersionModal || showPrivacyModal || !!activeRatingBooking;

  return (
    <div id="profile-tab-content" className="flex-1 flex flex-col overflow-hidden select-none bg-neutral-50 text-neutral-800 relative">
      
      {/* Toast Alert overlay */}
      {toastMsg && (
        <div id="profile-toast" className="absolute top-[90px] left-1/2 -translate-x-1/2 w-80 bg-neutral-900 text-emerald-400 p-3 rounded-xl shadow-2xl text-xs font-black text-center z-50 flex items-center justify-center gap-1.5 animate-bounce border border-emerald-500">
          <Sparkles size={13} className="text-emerald-400 animate-pulse" />
          <span>{toastMsg}</span>
        </div>
      )}

      {isEditing ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          {/* Top Header */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              Chỉnh sửa thông tin
            </h2>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left bg-white">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">Họ và tên</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-emerald-500 font-semibold transition shadow-sm"
                placeholder="Nhập họ tên đầy đủ..."
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">Giới tính</label>
              <div className="flex gap-2">
                {['Nam', 'Nữ', 'Khác'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setEditGender(g)}
                    className={`flex-1 py-2.5 border border-transparent text-sm font-bold rounded-xl transition cursor-pointer shadow-sm ${
                      editGender === g
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Area Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">Khu vực hoạt động</label>
              <input
                type="text"
                value={editArea}
                onChange={e => setEditArea(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-emerald-500 font-semibold transition shadow-sm"
                placeholder="Nhập khu vực hoạt động chính..."
              />
            </div>

            {/* Favorite Sports Checklist */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-500 font-bold block uppercase tracking-wider">Môn thể thao hoạt động</label>
              <div className="grid grid-cols-2 gap-3">
                {ACTIVE_SPORTS.map(sport => {
                  const isChecked = editSports.includes(sport);
                  return (
                    <div
                      key={sport}
                      className={`border text-left transition shadow-sm rounded-xl overflow-hidden ${
                        isChecked
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          : 'border-neutral-200 text-neutral-600 bg-neutral-50 hover:bg-neutral-100'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleEditSport(sport)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-extrabold text-left cursor-pointer"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                          isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="truncate">{sportLabels[sport]}</span>
                      </button>
                      {isChecked && (
                        <div className="px-3 pb-3">
                          <select
                            value={editSkillLevels[sport] || 'Beginner'}
                            onChange={e => setEditSportSkill(sport, e.target.value as SkillLevel)}
                            className="w-full bg-white border border-emerald-100 rounded-lg px-2.5 py-2 text-[11px] font-bold text-neutral-700 focus:outline-emerald-500"
                          >
                            {SKILL_OPTIONS.map(skill => (
                              <option key={skill} value={skill}>{skill}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-6 border-t border-neutral-100 pb-12 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-extrabold text-xs rounded-xl cursor-pointer transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  const selectedSports = ACTIVE_SPORTS.filter(sport => editSports.includes(sport));
                  const nextSkillLevels = { ...user.skillLevels };
                  selectedSports.forEach(sport => {
                    nextSkillLevels[sport] = editSkillLevels[sport] || 'Beginner';
                  });
                  updateUserProfile({
                    name: editName,
                    gender: editGender,
                    activeArea: editArea,
                    favoriteSports: selectedSports,
                    skillLevels: nextSkillLevels,
                  });
                  setIsEditing(false);
                  triggerToast('Cập nhật thông tin cá nhân thành công!');
                }}
                className="flex-[2] py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      ) : !isAnyModalOpen ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scrollbar-none animate-fadeIn text-neutral-800">

          {/* 1. Upper Profile Cover & Card (No yellow member tier and rank mentions as requested) */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-2xs text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-bl-full z-0"></div>
        
        <div className="relative z-10 flex items-center gap-4">
          <SafeImage
            src={user.avatar}
            fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
            alt={user.name}
            className="w-16 h-16 rounded-full border-2 border-emerald-500 object-cover shadow-sm bg-neutral-100"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full select-none flex items-center gap-0.5 uppercase tracking-wider">
                <UserCheck size={9} /> Tài khoản xác thực
              </span>
            </div>
            <h2 className="text-base font-black text-neutral-850 uppercase mt-1 leading-tight">{user.name}</h2>
            <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card Block */}
      <div className="bg-gradient-to-tr from-neutral-900 to-neutral-850 p-4 rounded-2xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Wallet size={16} className="text-emerald-400" />
            <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Ví Điện Tử Của Tôi</span>
          </div>
          <span className="text-[9px] text-neutral-450 font-semibold bg-neutral-800 px-2 py-0.5 rounded-full">
            Hoạt động
          </span>
        </div>

        <div className="mt-3.5 text-left">
          <span className="text-[9px] text-neutral-400 font-bold block">Tổng số tiền khả dụng</span>
          <span className="text-xl font-black text-emerald-450 block tracking-tight mt-0.5">
            {user.walletBalance.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="mt-3.5 pt-3 border-t border-neutral-800/60 flex justify-between items-center">
          <span className="text-[8px] text-neutral-400 font-semibold">Tự động trừ tiền khi đặt lịch thể thao</span>
          <button 
            onClick={() => {
              depositWallet(200000);
              triggerToast('Nạp nhanh thành công +200.000đ từ tài khoản MoMo!');
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-[9px] px-3.5 py-1.5 rounded-full cursor-pointer transition shadow-md active:scale-95"
          >
            +200k MoMo
          </button>
        </div>
      </div>

      {/* 2. THÔNG TIN CÁ NHÂN (Xuyển qua trang chỉnh sửa riêng biệt) */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 text-left space-y-3.5 shadow-2xs relative">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-neutral-700 uppercase tracking-tight flex items-center gap-1.5">
            👤 Thông tin cá nhân
          </h3>
          <button
            onClick={() => {
              setEditName(user.name);
              setEditGender(user.gender || 'Nam');
              setEditArea(user.activeArea || 'Thạch Thất, Hà Nội');
              setEditSports(user.favoriteSports || []);
              setEditSkillLevels(user.skillLevels);
              setIsEditing(true);
            }}
            className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 px-3 py-1 rounded-full cursor-pointer transition active:scale-95"
          >
            Chỉnh sửa
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-neutral-55 p-2.5 rounded-xl border border-neutral-100/60 font-semibold">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Họ và tên</span>
              <span className="font-extrabold text-neutral-700 mt-0.5 block">{user.name}</span>
            </div>
            <div className="bg-neutral-55 p-2.5 rounded-xl border border-neutral-100/60 font-semibold">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Giới tính</span>
              <span className="font-extrabold text-neutral-700 mt-0.5 block">{user.gender || 'Nam'}</span>
            </div>
          </div>

          <div className="bg-neutral-55 p-2.5 rounded-xl border border-neutral-100/60 text-xs text-left font-semibold">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Khu vực hoạt động</span>
            <span className="font-extrabold text-neutral-700 mt-0.5 block flex items-center gap-1">
              📍 {user.activeArea || 'Thạch Thất, Hà Nội'}
            </span>
          </div>

          <div className="bg-neutral-55 p-2.5 rounded-xl border border-neutral-100/60 text-xs text-left font-semibold">
            <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider mb-1.5 font-bold">Môn thể thao hoạt động</span>
            <div className="flex flex-wrap gap-1.5">
              {user.favoriteSports.length === 0 ? (
                <span className="text-neutral-400 font-semibold text-[10px]">Chưa cài đặt bộ môn</span>
              ) : (
                user.favoriteSports.map(sport => {
                  const skill = user.skillLevels?.[sport] || 'Chưa cập nhật';
                  return (
                    <span key={sport} className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-black px-2.5 py-1 rounded-lg">
                      {sportLabels[sport] || sport} - <span className="text-emerald-500 font-semibold">{skill}</span>
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. GENERAL SETTINGS CONTROLS (Exact menus requested) */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-2xs text-left text-xs divide-y divide-neutral-100">
        
        {/* Lịch đã đặt */}
        <div 
          onClick={() => {
            setActiveScheduleTab('bookings');
            setShowBookingsModal(true);
          }}
          className="p-3.5 flex justify-between items-center hover:bg-neutral-50/50 transition cursor-pointer"
        >
          <span className="font-bold text-neutral-700 flex items-center gap-2">
            📅 Lịch đã đặt
          </span>
          <div className="flex items-center gap-1.5">
            {userBookings.length + userMatches.length > 0 && (
              <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {userBookings.length + userMatches.length}
              </span>
            )}
            <ChevronRight size={13} className="text-neutral-400" />
          </div>
        </div>

        {/* Cài đặt */}
        <div 
          onClick={() => setShowSettingsModal(true)}
          className="p-3.5 flex justify-between items-center hover:bg-neutral-50/50 transition cursor-pointer"
        >
          <span className="font-bold text-neutral-700 flex items-center gap-2">
            ⚙️ Cài đặt
          </span>
          <ChevronRight size={13} className="text-neutral-400" />
        </div>

        {/* Thông tin phiên bản */}
        <div 
          onClick={() => setShowVersionModal(true)}
          className="p-3.5 flex justify-between items-center hover:bg-neutral-50/50 transition cursor-pointer"
        >
          <span className="font-bold text-neutral-700 flex items-center gap-2">
            ℹ️ Thông tin phiên bản
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full font-bold">Latest v2.5</span>
            <ChevronRight size={13} className="text-neutral-400" />
          </div>
        </div>

        {/* Điều khoản chính sách */}
        <div 
          onClick={() => setShowPrivacyModal(true)}
          className="p-3.5 flex justify-between items-center hover:bg-neutral-50/50 transition cursor-pointer"
        >
          <span className="font-bold text-neutral-700 flex items-center gap-2">
            🛡️ Điều khoản chính sách
          </span>
          <ChevronRight size={13} className="text-neutral-400" />
        </div>

        {/* Đăng xuất */}
        <div 
          onClick={() => setShowLogoutModal(true)}
          className="p-3.5 flex justify-between items-center hover:bg-red-50 text-red-600 transition cursor-pointer"
        >
          <span className="font-bold flex items-center gap-2 text-red-600">
            <LogOut size={13} className="text-red-500" /> Đăng xuất
          </span>
          <ChevronRight size={13} className="text-red-400" />
        </div>

      </div>

        </div>
      ) : showBookingsModal ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          {/* Top Header */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <button 
              onClick={() => setShowBookingsModal(false)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              📅 Lịch đã đặt
            </h2>
          </div>

          <div className="bg-white border-b border-neutral-100 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveScheduleTab('bookings')}
                className={`py-2 rounded-xl text-[11px] font-black transition ${
                  activeScheduleTab === 'bookings' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Đặt sân ({userBookings.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveScheduleTab('matches')}
                className={`py-2 rounded-xl text-[11px] font-black transition ${
                  activeScheduleTab === 'matches' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-neutral-500'
                }`}
              >
                Trận đấu ({userMatches.length})
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left">
            {activeScheduleTab === 'bookings' && (
              userBookings.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <Calendar size={42} className="text-neutral-300 mx-auto" />
                  <p className="text-xs text-neutral-450 font-bold">Bạn chưa đặt sân nào.</p>
                  <p className="text-[10px] text-neutral-400">Các lượt đặt sân thật sẽ xuất hiện tại đây.</p>
                </div>
              ) : (
                userBookings.map((b) => {
                  const statusMeta = getBookingStatusMeta(b.status);
                  return (
                  <div key={b.id} className="bg-white rounded-2xl border border-neutral-150 p-4 space-y-3.5 text-xs relative overflow-hidden transition hover:shadow-2xs">
                    <div className="flex justify-between items-start gap-1">
                      <div className="min-w-0">
                        <span className="text-[8.5px] bg-blue-50 text-blue-600 border border-blue-150 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                          {sportLabels[b.sport] || b.sport}
                        </span>
                        <h4 className="font-black text-neutral-850 text-xs mt-2.5 truncate leading-tight">
                          {b.courtName}
                        </h4>
                        <p className="text-[10px] text-neutral-450 font-bold mt-1">
                          Cụm sân: {b.subCourtName}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end shrink-0">
                        <span className="font-black text-emerald-600 text-xs text-emerald-650">
                          {b.price.toLocaleString('vi-VN')}đ
                        </span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase mt-1 ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[10.5px]">
                      <div>
                        <span className="text-[8.5px] text-neutral-400 font-bold block">NGÀY ĐẶT</span>
                        <span className="font-black text-neutral-700">{formatVNStyleDate(b.date)}</span>
                      </div>
                      <div>
                        <span className="text-[8.5px] text-neutral-400 font-bold block">KHUNG GIỜ</span>
                        <span className="font-black text-neutral-700">{b.timeSlot}</span>
                      </div>
                    </div>

                    {b.status === 'confirmed' && (
                      <div className="flex flex-col gap-2 pt-2.5 border-t border-dashed border-neutral-150">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-white border border-neutral-200 flex items-center justify-center p-0.5 rounded shadow-3xs animate-pulse">
                              <span className="text-[8px] font-mono leading-none font-bold text-center">QR</span>
                            </div>
                            <span className="text-[9px] text-neutral-400 font-semibold tracking-wide uppercase">
                              Mã: {b.qrcode.substring(0, 14)}...
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                cancelBooking(b.id);
                                triggerToast('Hủy đặt sân thành công! Bạn được hoàn 85% tiền vào tài khoản.');
                              }}
                              className="bg-red-50 hover:bg-red-100 text-red-500 text-[9px] font-extrabold px-2 py-1 rounded-lg transition cursor-pointer"
                            >
                              Hủy (85%)
                            </button>
                            <button
                              onClick={() => {
                                completeBooking(b.id);
                                triggerToast('Vé đã được chuyển sang trạng thái hoàn thành.');
                              }}
                              className="bg-[#10B981] hover:bg-emerald-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg transition shadow-xs cursor-pointer"
                            >
                              Hoàn thành
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {b.status === 'completed' && (
                      <div className="flex items-center justify-between gap-1.5 pt-2.5 border-t border-dashed border-neutral-150 text-[10px]">
                        <span className="text-neutral-450 font-bold">Lượt đặt sân đã hoàn thành.</span>
                        <button
                          onClick={() => {
                            startEvaluation(b);
                          }}
                          className="text-[#10B981] font-black hover:underline hover:text-emerald-700 transition"
                        >
                          Xem phản hồi &amp; đánh giá
                        </button>
                      </div>
                    )}
                  </div>
                  );
                })
              )
            )}

            {activeScheduleTab === 'matches' && (
              userMatches.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <Trophy size={42} className="text-neutral-300 mx-auto" />
                  <p className="text-xs text-neutral-450 font-bold">Bạn chưa tham gia trận đấu nào.</p>
                  <p className="text-[10px] text-neutral-400">Các trận bạn tạo hoặc tham gia sẽ xuất hiện tại đây.</p>
                </div>
              ) : (
                userMatches.map((match) => {
                  const statusMeta = getMatchStatusMeta(match.status);
                  return (
                    <div key={match.id} className="bg-white rounded-2xl border border-neutral-150 p-4 space-y-3 text-xs relative overflow-hidden transition hover:shadow-2xs">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <span className="text-[8.5px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            {sportLabels[match.sport] || match.sport}
                          </span>
                          <h4 className="font-black text-neutral-850 text-xs mt-2.5 truncate leading-tight">
                            {match.title}
                          </h4>
                          <p className="text-[10px] text-neutral-450 font-bold mt-1 truncate">
                            {match.courtName} • {match.address}
                          </p>
                        </div>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase shrink-0 ${statusMeta.className}`}>
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[10.5px]">
                        <div>
                          <span className="text-[8.5px] text-neutral-400 font-bold block">NGÀY GIỜ</span>
                          <span className="font-black text-neutral-700">{formatVNStyleDate(match.date)} • {match.time}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-neutral-400 font-bold block">NGƯỜI TẠO</span>
                          <span className="font-black text-neutral-700">{match.creatorName}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-bold">
                        <span>{match.players.length}/{match.maxPlayers} người tham gia</span>
                        <span>Trình độ: {match.level || 'Không yêu cầu'}</span>
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
        </div>
      ) : showSettingsModal ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          {/* Top Header */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              ⚙️ Cài đặt hệ thống
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left bg-white">
            {/* Push notifications */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-extrabold text-neutral-700">Thông báo đẩy (Push Notifications)</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Nhận thông báo khi đối thủ ghép cặp thành công</p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsPush(!settingsPush)}
                className={`w-9 h-5 rounded-full transition relative flex items-center ${
                  settingsPush ? 'bg-[#10B981]' : 'bg-neutral-250'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  settingsPush ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Sound & haptics */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-extrabold text-neutral-700">Âm thanh &amp; Rung</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Phát âm thanh khi có tin nhắn từ chủ sân</p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsSound(!settingsSound)}
                className={`w-9 h-5 rounded-full transition relative flex items-center ${
                  settingsSound ? 'bg-[#10B981]' : 'bg-neutral-250'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  settingsSound ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* OneTouch Auto Pay */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex justify-between items-center text-xs">
              <div>
                <h4 className="font-extrabold text-neutral-700">Thanh toán rảnh tay MoMo</h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">Bỏ qua nhập mật khẩu cho đặt sân giá trị nhỏ hơn 100k</p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsAutoPay(!settingsAutoPay)}
                className={`w-9 h-5 rounded-full transition relative flex items-center ${
                  settingsAutoPay ? 'bg-[#10B981]' : 'bg-neutral-250'
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  settingsAutoPay ? 'translate-x-4.5' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Action Save button */}
            <button
              onClick={() => {
                setShowSettingsModal(false);
                triggerToast('Đã lưu cấu hình cài đặt cá nhân!');
              }}
              className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md mt-6"
            >
              Lưu &amp; Áp dụng
            </button>
          </div>
        </div>
      ) : showVersionModal ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          {/* Top Header */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <button 
              onClick={() => setShowVersionModal(false)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              ℹ️ Thông tin phiên bản
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-5 text-center space-y-5 bg-white">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <Info size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-neutral-850 uppercase tracking-widest">
                SportRes Pro
              </h3>
              <p className="text-blue-600 text-xs font-black font-mono bg-blue-50 px-3 py-1 rounded-full inline-block">
                Phiên bản v2.5.0
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl text-left text-[11px] text-neutral-600 leading-relaxed space-y-3 font-semibold border border-neutral-100">
              <p>• <b>Engine:</b> AI Matchmaking Core v1.4</p>
              <p>• <b>Map Services:</b> GPS Routing API v2.0</p>
              <p>• <b>Bản quyền:</b> © 2026 SportRes Corporation. Phát triển bởi những kỹ sư tận tâm phục vụ phong trào thể thao xã hội.</p>
              <p className="text-[10px] text-emerald-600 font-extrabold mt-1.5">• Đang chạy trên nền vạch định tuyến bảo mật cao mới nhất.</p>
            </div>

            <button
              onClick={() => setShowVersionModal(false)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md"
            >
              Tuyệt vời
            </button>
          </div>
        </div>
      ) : showPrivacyModal ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          {/* Top Header */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              🛡️ Điều khoản chính sách
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 text-left space-y-4 bg-white">
            <div className="space-y-3 text-[11px] text-neutral-600 font-semibold leading-relaxed">
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <h4 className="text-xs font-black text-neutral-800 uppercase">1. Quy tắc ứng xử cơ sở</h4>
                <p className="mt-1 font-semibold text-neutral-500">Người chơi tham gia các kèo ghép cặp đôi hoặc đối thủ tuyệt đối giữ thái độ văn minh, đúng giờ. Các hành động vắng mặt không lý do chính đáng sẽ bị cảnh cáo hoặc giảm độ tín nhiệm thi đấu.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <h4 className="text-xs font-black text-neutral-800 uppercase">2. Chính sách hoàn hủy đặt sân</h4>
                <p className="mt-1 font-semibold text-neutral-500">Khi đặt sân thông qua hệ thống:</p>
                <p className="mt-1 font-semibold text-neutral-500">• Hủy trước 4 giờ so với giờ đá: Hệ thống hoàn tiền 85% giá trị về ví MoMo.</p>
                <p className="mt-0.5 font-semibold text-neutral-500">• Hủy muộn dưới 4 giờ: Số tiền cọc sân không được hoàn trả nhằm hỗ trợ chủ đầu tư.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <h4 className="text-xs font-black text-neutral-800 uppercase">3. An toàn thông tin</h4>
                <p className="mt-1 font-semibold text-neutral-500">Số điện thoại của các bên tham gia kèo đối chiến sẽ chỉ được cung cấp cho trưởng đoàn khi kèo đấu đã chính thức được thiết lập ghép đôi, để điều hướng vị trí.</p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                <h4 className="text-xs font-black text-neutral-800 uppercase">4. Tuyên bố từ chối trách nhiệm</h4>
                <p className="mt-1 font-semibold text-neutral-500">Hệ thống cung cấp liên kết các sân đấu chính thống. Mọi hư hỏng, sự cố thể chất trên sân được giải quyết nội bộ giữa các cá nhân tại sân.</p>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition cursor-pointer mt-4 shadow-md"
            >
              Tôi đồng ý các điều khoản
            </button>
          </div>
        </div>
      ) : activeRatingBooking ? (
        <div className="absolute inset-0 bg-neutral-50 z-55 flex flex-col animate-fadeIn overflow-hidden text-neutral-800">
          
          {/* Top navigation header with a left arrow */}
          <div className="flex items-center px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0">
            <button 
              onClick={() => setActiveRatingBooking(null)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="flex-1 text-center text-xs font-black text-neutral-800 uppercase tracking-widest -translate-x-3.5">
              Đánh giá sau trận đấu
            </h2>
          </div>

          {/* Main scrollable area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Header section with trophy */}
            <div className="text-center space-y-2.5 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto border border-emerald-100 shadow-3xs">
                <Trophy size={24} className="text-[#10B981]" />
              </div>

              <div className="space-y-1">
                <h1 className="text-base font-black text-neutral-900 tracking-tight">Trận đấu đã kết thúc!</h1>
                <p className="text-[11px] text-neutral-500 font-semibold px-4 max-w-sm mx-auto leading-relaxed">
                  Hãy dành chút thời gian đánh giá đồng đội và đối thủ của bạn để cải thiện cộng đồng SportRes.
                </p>
              </div>
            </div>

            {/* List of members to rate */}
            <div className="space-y-2">
              <span className="text-[9.5px] font-black tracking-wider text-neutral-450 uppercase block text-left">
                Thành viên tham gia
              </span>

              <div className="space-y-2">
                {membersToRate.map((member) => (
                  <div 
                    key={member.id} 
                    className="bg-white rounded-2xl p-3 flex items-center justify-between border border-neutral-100 shadow-2xs"
                  >
                    {/* Left content: Avatar, Name and Rating Stars */}
                    <div className="flex items-center gap-3 text-left">
                      <SafeImage 
                        src={member.avatar} 
                        fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-3xs bg-neutral-50" 
                      />
                      <div>
                        <h4 className="font-extrabold text-neutral-800 text-xs">{member.name}</h4>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRateMember(member.id, star)}
                              className="p-0.5 focus:outline-none transition transform active:scale-125"
                            >
                              <Star
                                size={13}
                                fill={star <= member.rating ? '#10B981' : 'none'}
                                className={
                                  star <= member.rating 
                                    ? 'text-[#10B981] stroke-[2]' 
                                    : 'text-neutral-250 stroke-[1.2]'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right content: Add friend action */}
                    <button
                      onClick={() => handleToggleFriend(member.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
                        member.added
                          ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                          : 'bg-[#10B981] text-white shadow-xs hover:bg-[#0E9F6E]'
                      }`}
                    >
                      {member.added ? <UserCheck size={14} /> : <UserPlus size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment of the Court just used */}
            <div className="space-y-2 pt-1">
              <span className="text-[9.5px] font-black tracking-wider text-neutral-450 uppercase block text-left">
                Đánh giá sân vừa sử dụng
              </span>

              <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-2xs text-left space-y-3">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[#0F172A] text-xs">
                    🏟️ {activeRatingBooking.courtName}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-bold">
                    Khu vực đặt: {activeRatingBooking.subCourtName} ({activeRatingBooking.timeSlot})
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-50 pt-2.5">
                  <span className="text-[11px] text-neutral-500 font-bold">Trải nghiệm dịch vụ &amp; cơ sở</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setCourtRating(star)}
                        className="p-0.5 focus:outline-none transition transform active:scale-125"
                      >
                        <Star
                          size={18}
                          fill={star <= courtRating ? '#EAB308' : 'none'}
                          className={
                            star <= courtRating 
                              ? 'text-amber-500 stroke-[2]' 
                              : 'text-neutral-250 stroke-[1.2]'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Complete Button matching the user design with green background */}
          <div className="p-4 bg-white border-t border-neutral-100 shrink-0">
            <button
              onClick={() => {
                // If the booking is not already marked as completed, complete it
                if (activeRatingBooking.status !== 'completed') {
                  completeBooking(activeRatingBooking.id);
                }
                setActiveRatingBooking(null);
                triggerToast('Cảm ơn bạn đã phản hồi đánh giá trận đấu!');
              }}
              className="w-full py-3.5 bg-[#10B981] hover:bg-emerald-600 active:scale-98 transition text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <span>Hoàn thành</span>
              <CheckCircle size={14} />
            </button>
          </div>

        </div>
      ) : null}

      {/* 5. LOGOUT CONFIRMATION DIALOG */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center z-55 p-4 animate-fadeIn">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 border border-neutral-100 shadow-2xl text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <LogOut size={28} className="translate-x-0.5" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-neutral-800 uppercase">
                Xác nhận đăng xuất?
              </h3>
              <p className="text-neutral-500 text-xs font-semibold px-2">
                Bạn muốn thoát khỏi tài khoản hiện tại?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs rounded-xl cursor-pointer transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  logoutUser();
                  onLogout();
                }}
                className="flex-1 py-3 bg-red-500 hover:bg-red-655 text-white font-extrabold text-xs rounded-xl cursor-pointer transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
