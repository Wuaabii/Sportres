import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import {
  ShieldCheck, Users, BarChart3, Building2, Calendar,
  TrendingUp, DollarSign, CheckCircle2, XCircle, Clock,
  Search, Activity, Zap, Star, Plus, Copy, X
} from 'lucide-react';
import { SafeImage } from './SafeImage';
import { SportType } from '../types';

export const AdminTab: React.FC = () => {
  const { courts, bookings, matches, tournaments, demoUsers, venueRequests, approveVenueRequest, rejectVenueRequestSubmission, approveBookingPayment, rejectBookingPayment, createVenueOwner } = useSport();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'payments' | 'users' | 'venues' | 'requests' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectionReasonById, setRejectionReasonById] = useState<Record<string, string>>({});
  const [showCreateOwner, setShowCreateOwner] = useState(false);
  const [createOwnerError, setCreateOwnerError] = useState<string | null>(null);
  const [isCreatingOwner, setIsCreatingOwner] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ phone: string; password: string } | null>(null);
  const [ownerForm, setOwnerForm] = useState({
    fullName: '',
    phone: '',
    temporaryPassword: '',
    venueName: '',
    address: '',
    district: '',
    sport: 'soccer' as Exclude<SportType, 'all'>,
  });

  const closeCreateOwner = () => {
    setShowCreateOwner(false);
    setCreateOwnerError(null);
    setCreatedCredentials(null);
    setOwnerForm({
      fullName: '',
      phone: '',
      temporaryPassword: '',
      venueName: '',
      address: '',
      district: '',
      sport: 'soccer',
    });
  };

  const handleCreateOwner = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsCreatingOwner(true);
    setCreateOwnerError(null);
    const result = await createVenueOwner(ownerForm);
    setIsCreatingOwner(false);
    if (!result.success) {
      setCreateOwnerError(result.error || 'Không thể tạo tài khoản chủ sân.');
      return;
    }
    setCreatedCredentials({ phone: ownerForm.phone, password: ownerForm.temporaryPassword });
  };

  const copyCredentials = async () => {
    if (!createdCredentials) return;
    await navigator.clipboard.writeText(
      `SportRes - Tài khoản chủ sân\nSố điện thoại: ${createdCredentials.phone}\nMật khẩu tạm thời: ${createdCredentials.password}`,
    );
  };

  // Platform Statistics
  const totalUsers = demoUsers.length;
  const totalPlayers = demoUsers.filter(u => u.role === 'player').length;
  const totalOwners = demoUsers.filter(u => u.role === 'venue_owner').length;
  const totalStaff = demoUsers.filter(u => u.role === 'staff').length;
  const totalVenues = courts.length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid' && ['confirmed', 'completed'].includes(b.status)).reduce((sum, b) => sum + b.price, 0);
  const pendingPayments = Array.from(
    bookings
      .filter(booking => booking.paymentStatus === 'waiting_admin_confirmation')
      .reduce((groups, booking) => {
        const key = booking.bookingGroupId || booking.id;
        const existing = groups.get(key);
        groups.set(key, existing ? {
          ...existing,
          price: existing.price + booking.price,
          subCourtName: [existing.subCourtName, booking.subCourtName]
            .filter((value, index, values) => values.indexOf(value) === index)
            .join(', '),
          timeSlot: [existing.timeSlot, booking.timeSlot].join(', '),
        } : booking);
        return groups;
      }, new Map<string, typeof bookings[number]>()),
  ).map(([, booking]) => booking);
  const totalMatches = matches.length;
  const openMatches = matches.filter(m => m.status === 'open').length;
  const totalTournaments = tournaments.length;
  const pendingVenueRequests = venueRequests.filter(request => request.status === 'pending');

  // Filtered users for search
  const filteredUsers = demoUsers.filter(u =>
    u.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.profile.phone || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleLabels: Record<string, { label: string; bg: string; text: string }> = {
    player: { label: 'Người chơi', bg: 'bg-blue-50', text: 'text-blue-600' },
    venue_owner: { label: 'Chủ sân', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    staff: { label: 'Nhân viên', bg: 'bg-purple-50', text: 'text-purple-600' },
    admin: { label: 'Admin', bg: 'bg-red-50', text: 'text-red-600' },
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 shadow-sm border-b border-neutral-100 shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg font-black text-neutral-800 uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck size={20} className="text-red-500" /> Quản trị hệ thống
            </h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
              SportRes Admin Dashboard
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <Zap size={20} />
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
          {(['overview', 'payments', 'users', 'venues', 'requests', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 min-w-[86px] py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition ${
                activeSubTab === tab
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {tab === 'overview' ? 'Tổng quan' : tab === 'payments' ? 'Duyệt đặt sân' : tab === 'users' ? 'Người dùng' : tab === 'venues' ? 'Sân bãi' : tab === 'requests' ? 'Duyệt sân mới' : 'Phân tích'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-5">
        {activeSubTab === 'overview' && (
          <div className="space-y-5">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Tổng người dùng</span>
                </div>
                <p className="text-xl font-black text-neutral-800">{totalUsers}</p>
                <div className="flex gap-2 mt-1 text-[9px] text-neutral-400 font-semibold">
                  <span>{totalPlayers} người chơi</span>
                  <span>•</span>
                  <span>{totalOwners} chủ sân</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Doanh thu</span>
                </div>
                <p className="text-xl font-black text-emerald-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
                <p className="text-[9px] text-neutral-400 font-semibold mt-1">Từ {totalBookings} đơn đặt sân</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Building2 size={16} />
                  </div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Sân thể thao</span>
                </div>
                <p className="text-xl font-black text-neutral-800">{totalVenues}</p>
                <p className="text-[9px] text-neutral-400 font-semibold mt-1">Đang hoạt động</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Activity size={16} />
                  </div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Trận đấu</span>
                </div>
                <p className="text-xl font-black text-neutral-800">{totalMatches}</p>
                <p className="text-[9px] text-neutral-400 font-semibold mt-1">{openMatches} đang mở ghép</p>
              </div>
            </div>

            {/* Booking Status Breakdown */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-tight flex items-center gap-1.5">
                <Calendar size={14} className="text-blue-500" /> Tình trạng đặt sân
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle2 size={18} className="text-emerald-500 mx-auto mb-1" />
                  <p className="text-sm font-black text-emerald-700">{confirmedBookings}</p>
                  <p className="text-[8px] font-bold text-emerald-500 uppercase">Đã xác nhận</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <Clock size={18} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-sm font-black text-blue-700">{completedBookings}</p>
                  <p className="text-[8px] font-bold text-blue-500 uppercase">Hoàn thành</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <XCircle size={18} className="text-red-500 mx-auto mb-1" />
                  <p className="text-sm font-black text-red-700">{cancelledBookings}</p>
                  <p className="text-[8px] font-bold text-red-500 uppercase">Đã hủy</p>
                </div>
              </div>
            </div>

            {/* Platform Status */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 p-4 rounded-2xl text-white space-y-3">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                <Zap size={14} className="text-amber-400" /> Trạng thái hệ thống
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-300 font-semibold">API Server: <span className="text-emerald-400 font-bold">Online</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-300 font-semibold">Database: <span className="text-emerald-400 font-bold">Connected</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-300 font-semibold">AI Engine: <span className="text-emerald-400 font-bold">Active</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-neutral-300 font-semibold">Giải đấu: <span className="text-amber-400 font-bold">{totalTournaments} active</span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-neutral-800 uppercase">Danh sách người dùng</h3>
                <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">Quản lý người chơi, chủ sân và nhân sự.</p>
              </div>
              <button
                onClick={() => setShowCreateOwner(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-[10px] font-black shadow-sm transition shrink-0"
              >
                <Plus size={13} /> Tạo chủ sân
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-neutral-300" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, username, số điện thoại..."
                className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-red-500 transition shadow-sm"
              />
            </div>

            {/* Role Stats */}
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(roleLabels).map(([role, style]) => {
                const count = demoUsers.filter(u => u.role === role).length;
                return (
                  <div key={role} className={`${style.bg} p-2.5 rounded-xl text-center`}>
                    <p className={`text-sm font-black ${style.text}`}>{count}</p>
                    <p className={`text-[8px] font-bold ${style.text} uppercase`}>{style.label}</p>
                  </div>
                );
              })}
            </div>

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.map(u => {
                const style = roleLabels[u.role] || roleLabels.player;
                return (
                  <div key={u.username} className="bg-white p-3.5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-3">
                    <SafeImage
                      src={u.profile.avatar}
                      fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
                      alt={u.profile.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shadow-sm bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-neutral-800 truncate">{u.profile.name}</h4>
                          <p className="text-[10px] text-neutral-400 font-semibold">@{u.username} • {u.profile.phone}</p>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'payments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Duyệt đặt sân ({pendingPayments.length})</h3>
            </div>
            {pendingPayments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
                <CheckCircle2 size={28} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-xs font-bold text-neutral-400">Không có chuyển khoản nào đang chờ xác minh.</p>
              </div>
            ) : pendingPayments.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 space-y-3">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black text-red-500 uppercase">Mã booking: {booking.bookingCode}</p>
                    <h4 className="text-sm font-black text-neutral-800">{booking.customerName}</h4>
                    <p className="text-[10px] text-neutral-500">{booking.customerPhone}</p>
                  </div>
                  <span className="text-[8px] font-black uppercase bg-amber-50 text-amber-600 px-2 py-1 rounded-lg h-fit">
                    Chờ xác minh
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-neutral-50 rounded-xl p-3 text-[10px]">
                  <span className="text-neutral-400">Sân</span><span className="font-bold text-right">{booking.courtName}</span>
                  <span className="text-neutral-400">Court</span><span className="font-bold text-right">{booking.subCourtName}</span>
                  <span className="text-neutral-400">Ngày / giờ</span><span className="font-bold text-right">{booking.date} · {booking.timeSlot}</span>
                  <span className="text-neutral-400">Số tiền</span><span className="font-black text-emerald-600 text-right">{booking.price.toLocaleString('vi-VN')}đ</span>
                  <span className="text-neutral-400">Nội dung CK</span><span className="font-black text-blue-600 text-right select-all">{booking.bookingCode}</span>
                  <span className="text-neutral-400">Trạng thái TT</span><span className="font-black text-amber-600 text-right">{booking.paymentStatus}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => rejectBookingPayment(booking.id)}
                    className="py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black"
                  >
                    Từ chối / Chưa nhận tiền
                  </button>
                  <button
                    onClick={() => approveBookingPayment(booking.id)}
                    className="py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black"
                  >
                    Xác nhận đã nhận tiền
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'venues' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-tight">Tất cả sân ({totalVenues})</h3>
            </div>
            <div className="space-y-3">
              {courts.slice(0, 10).map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <SafeImage
                      src={c.imageUrl}
                      fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800"
                      sportType={c.sport}
                      className="w-20 h-16 rounded-xl object-cover shrink-0 bg-neutral-100"
                      alt={c.name}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-neutral-800 tracking-tight truncate">{c.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-semibold mt-0.5 truncate">{c.address}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] font-bold text-neutral-500">
                          {c.sport === 'soccer' ? '⚽ Bóng đá' : c.sport === 'badminton' ? '🏸 Cầu lông' : c.sport === 'tennis' ? '🎾 Tennis' : c.sport === 'basketball' ? '🏀 Bóng rổ' : c.sport}
                        </span>
                        <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600">
                          <Star size={9} className="fill-amber-400 text-amber-400" /> {c.rating}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-600">
                          {c.priceMin.toLocaleString('vi-VN')}đ~
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase">Mở</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase tracking-tight">Duyệt sân mới ({pendingVenueRequests.length})</h3>
            </div>

            {venueRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
                <Clock size={28} className="mx-auto text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-neutral-400">Chưa có yêu cầu thêm sân nào.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {venueRequests.map(request => (
                  <div key={request.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-neutral-400 uppercase">{request.ownerName}</p>
                        <h4 className="text-sm font-black text-neutral-800 truncate">{request.name}</h4>
                        <p className="text-[10px] text-neutral-500 font-semibold mt-1">{request.ownerPhone || 'Chưa có liên hệ'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase shrink-0 ${
                        request.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-500 bg-neutral-50 rounded-xl p-3">
                      <span>{request.address}</span>
                      <span className="text-right">{request.district}</span>
                      <span>{request.sport}</span>
                      <span className="text-right">{request.pricePerHour.toLocaleString('vi-VN')}đ/giờ</span>
                      <span>{request.openingHour} - {request.closingHour}</span>
                      <span className="text-right">Nghỉ: {request.closedDays}</span>
                    </div>

                    {request.description && (
                      <p className="text-[10px] text-neutral-600 leading-relaxed">{request.description}</p>
                    )}

                    {request.status === 'pending' && (
                      <>
                        <input
                          value={rejectionReasonById[request.id] || ''}
                          onChange={(e) => setRejectionReasonById(prev => ({ ...prev, [request.id]: e.target.value }))}
                          placeholder="Lý do từ chối (tuỳ chọn)"
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => approveVenueRequest(request.id)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
                          >
                            <CheckCircle2 size={13} /> Duyệt yêu cầu
                          </button>
                          <button
                            onClick={() => rejectVenueRequestSubmission(request.id, rejectionReasonById[request.id])}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase"
                          >
                            <XCircle size={13} /> Từ chối
                          </button>
                        </div>
                      </>
                    )}

                    {request.status === 'rejected' && request.rejectionReason && (
                      <div className="bg-red-50 text-red-600 rounded-xl p-3 text-[10px] font-bold">
                        Lý do từ chối: {request.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'analytics' && (
          <div className="space-y-5">
            {/* Revenue Analytics */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-tight flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-500" /> Phân tích doanh thu
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[8px] font-black text-neutral-400 uppercase mb-1">Hôm nay</p>
                  <p className="text-sm font-black text-neutral-800">{(totalRevenue * 0.15).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[8px] font-black text-neutral-400 uppercase mb-1">Tuần này</p>
                  <p className="text-sm font-black text-neutral-800">{(totalRevenue * 0.6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}đ</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[8px] font-black text-neutral-400 uppercase mb-1">Tháng này</p>
                  <p className="text-sm font-black text-emerald-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            </div>

            {/* Sport Distribution */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-tight flex items-center gap-1.5">
                <BarChart3 size={14} className="text-blue-500" /> Phân bổ theo môn thể thao
              </h3>
              <div className="space-y-2">
                {[
                  { sport: 'Bóng đá ⚽', count: courts.filter(c => c.sport === 'soccer').length, color: 'bg-emerald-500' },
                  { sport: 'Cầu lông 🏸', count: courts.filter(c => c.sport === 'badminton').length, color: 'bg-blue-500' },
                  { sport: 'Tennis 🎾', count: courts.filter(c => c.sport === 'tennis').length, color: 'bg-amber-500' },
                  { sport: 'Bóng rổ 🏀', count: courts.filter(c => c.sport === 'basketball').length, color: 'bg-purple-500' },
                  { sport: 'Pickleball 🏓', count: courts.filter(c => c.sport === 'pickleball').length, color: 'bg-pink-500' },
                  { sport: 'Bóng chuyền 🏐', count: courts.filter(c => c.sport === 'volleyball').length, color: 'bg-orange-500' },
                  { sport: 'Golf ⛳', count: courts.filter(c => c.sport === 'golf').length, color: 'bg-teal-500' },
                ].filter(s => s.count > 0).map((s) => (
                  <div key={s.sport} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-neutral-600 w-28 shrink-0">{s.sport}</span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color} transition-all duration-500`}
                        style={{ width: `${Math.max((s.count / totalVenues) * 100, 8)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-neutral-800 w-6 text-right">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Growth */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-2xl text-white space-y-2">
              <h3 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                <TrendingUp size={14} /> Tăng trưởng nền tảng
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl text-center">
                  <p className="text-lg font-black">+{totalPlayers}</p>
                  <p className="text-[8px] font-bold text-white/70 uppercase">Người chơi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl text-center">
                  <p className="text-lg font-black">+{totalVenues}</p>
                  <p className="text-[8px] font-bold text-white/70 uppercase">Sân bãi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl text-center">
                  <p className="text-lg font-black">+{totalMatches}</p>
                  <p className="text-[8px] font-bold text-white/70 uppercase">Trận đấu</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateOwner && (
        <div className="fixed inset-0 z-70 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-100">
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-neutral-100 flex items-center justify-between z-10">
              <div>
                <h3 className="text-sm font-black text-neutral-800 uppercase">Tạo tài khoản chủ sân</h3>
                <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">Tài khoản và cơ sở được kích hoạt ngay.</p>
              </div>
              <button onClick={closeCreateOwner} className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100">
                <X size={17} />
              </button>
            </div>

            {createdCredentials ? (
              <div className="p-5 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={25} />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-black text-emerald-700">Đã tạo tài khoản chủ sân thành công</h4>
                  <p className="text-[10px] text-neutral-500 mt-1">Mật khẩu này chỉ hiển thị trong lần tạo hiện tại.</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 grid grid-cols-2 gap-3 text-[11px]">
                  <span className="text-neutral-400 font-bold">Số điện thoại</span>
                  <span className="font-black text-right select-all">{createdCredentials.phone}</span>
                  <span className="text-neutral-400 font-bold">Mật khẩu tạm thời</span>
                  <span className="font-black text-right select-all">{createdCredentials.password}</span>
                </div>
                <button
                  onClick={copyCredentials}
                  className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-black flex items-center justify-center gap-2"
                >
                  <Copy size={14} /> Sao chép thông tin đăng nhập
                </button>
                <button
                  onClick={closeCreateOwner}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black"
                >
                  Hoàn tất
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateOwner} className="p-5 space-y-3">
                {[
                  ['fullName', 'Họ và tên chủ sân', 'Nguyễn Văn A'],
                  ['phone', 'Số điện thoại', '09xxxxxxxx'],
                  ['temporaryPassword', 'Mật khẩu tạm thời', 'Tối thiểu 6 ký tự'],
                  ['venueName', 'Tên cơ sở/sân', 'Sport Center Hòa Lạc'],
                  ['address', 'Địa chỉ', 'Số nhà, đường, phường/xã'],
                  ['district', 'Khu vực/quận huyện', 'Thạch Thất, Hà Nội'],
                ].map(([field, label, placeholder]) => (
                  <label key={field} className="block space-y-1.5">
                    <span className="text-[10px] font-black text-neutral-500 uppercase">{label}</span>
                    <input
                      type={field === 'temporaryPassword' ? 'password' : 'text'}
                      value={ownerForm[field as keyof typeof ownerForm]}
                      onChange={event => setOwnerForm(previous => ({ ...previous, [field]: event.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </label>
                ))}

                <label className="block space-y-1.5">
                  <span className="text-[10px] font-black text-neutral-500 uppercase">Môn thể thao chính</span>
                  <select
                    value={ownerForm.sport}
                    onChange={event => setOwnerForm(previous => ({ ...previous, sport: event.target.value as Exclude<SportType, 'all'> }))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="soccer">Bóng đá</option>
                    <option value="badminton">Cầu lông</option>
                    <option value="tennis">Tennis</option>
                    <option value="basketball">Bóng rổ</option>
                    <option value="pickleball">Pickleball</option>
                    <option value="volleyball">Bóng chuyền</option>
                    <option value="golf">Golf</option>
                  </select>
                </label>

                {createOwnerError && (
                  <p className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                    {createOwnerError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeCreateOwner}
                    className="py-3 rounded-xl bg-neutral-100 text-neutral-600 text-xs font-black"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingOwner}
                    className="py-3 rounded-xl bg-emerald-600 disabled:bg-neutral-300 text-white text-xs font-black"
                  >
                    {isCreatingOwner ? 'Đang tạo...' : 'Tạo tài khoản'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
