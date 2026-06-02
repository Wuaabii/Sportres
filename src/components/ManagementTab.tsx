import React, { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Star,
  TrendingUp,
  UserRound,
  XCircle,
} from 'lucide-react';
import { useSport } from '../context/SportContext';
import { SafeImage } from './SafeImage';
import { SportType } from '../types';

type ManageTab = 'dashboard' | 'bookings' | 'schedule' | 'customers';

const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

const isRevenueBooking = (status: string) => status === 'confirmed' || status === 'completed';

const SPORT_OPTIONS: { value: SportType; label: string }[] = [
  { value: 'soccer', label: 'Football' },
  { value: 'badminton', label: 'Badminton' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'pickleball', label: 'Pickleball' },
  { value: 'basketball', label: 'Basketball' },
  { value: 'volleyball', label: 'Volleyball' },
  { value: 'golf', label: 'Golf' },
];

export const ManagementTab: React.FC = () => {
  const {
    user,
    courts,
    bookings,
    selectedDate,
    setSelectedDate,
    acceptBooking,
    rejectBooking,
    updateSlotAvailability,
    submitVenueRequest,
  } = useSport();

  const [activeSubTab, setActiveSubTab] = useState<ManageTab>('dashboard');
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [selectedSubCourtId, setSelectedSubCourtId] = useState('');
  const [replyTextByReview, setReplyTextByReview] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});
  const [showCreateVenueModal, setShowCreateVenueModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    address: '',
    district: '',
    sport: 'soccer' as SportType,
    pricePerHour: '200000',
    openingHour: '05:00',
    closingHour: '22:00',
    closedDays: 'Không',
    description: '',
    imageUrl: '',
  });

  const manageableCourts = user.role === 'venue_owner'
    ? courts.filter(court => court.ownerId === user.id)
    : courts;
  const manageableBookings = user.role === 'venue_owner'
    ? bookings.filter(booking => booking.ownerId === user.id || manageableCourts.some(court => court.id === booking.courtId))
    : bookings;

  const selectedCourt = manageableCourts.find(c => c.id === selectedCourtId) || manageableCourts[0];
  const selectedSubCourt = selectedCourt?.subCourts.find(s => s.id === selectedSubCourtId) || selectedCourt?.subCourts[0];

  const dailyRevenue = manageableBookings
    .filter(b => b.date === selectedDate && isRevenueBooking(b.status))
    .reduce((sum, b) => sum + b.price, 0);

  const monthKey = selectedDate.slice(0, 7);
  const monthlyRevenue = manageableBookings
    .filter(b => b.date.startsWith(monthKey) && isRevenueBooking(b.status))
    .reduce((sum, b) => sum + b.price, 0);

  const totalSlots = manageableCourts.reduce((sum, c) => {
    return sum + c.subCourts.reduce((subSum, sub) => subSum + (sub.slots[selectedDate]?.length || 0), 0);
  }, 0);

  const occupiedSlots = manageableCourts.reduce((sum, c) => {
    return sum + c.subCourts.reduce((subSum, sub) => {
      return subSum + (sub.slots[selectedDate]?.filter(slot => slot.isBooked || slot.isBlocked).length || 0);
    }, 0);
  }, 0);

  const occupancyRate = totalSlots ? Math.round((occupiedSlots / totalSlots) * 100) : 0;
  const pendingBookings = manageableBookings.filter(b => b.status === 'pending');

  const customers = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      phone: string;
      email: string;
      totalBookings: number;
      totalSpend: number;
      lastBooking: string;
    }>();

    manageableBookings.forEach(booking => {
      const key = booking.customerId || booking.customerPhone || booking.customerName || booking.id;
      const existing = map.get(key);
      map.set(key, {
        id: key,
        name: booking.customerName || 'Khách vãng lai',
        phone: booking.customerPhone || 'Chưa cập nhật',
        email: booking.customerEmail || 'Chưa cập nhật',
        totalBookings: (existing?.totalBookings || 0) + 1,
        totalSpend: (existing?.totalSpend || 0) + booking.price,
        lastBooking: existing && existing.lastBooking > booking.date ? existing.lastBooking : booking.date,
      });
    });

    return Array.from(map.values());
  }, [manageableBookings]);

  const reviews = [
    {
      id: 'review-1',
      customer: customers[0]?.name || 'Minh Quân',
      rating: 5,
      court: manageableCourts[0]?.name || 'Sân thể thao',
      comment: 'Sân sạch, nhân viên hỗ trợ nhanh. Mình muốn đặt lại khung 18:00 tuần sau.',
    },
    {
      id: 'review-2',
      customer: customers[1]?.name || 'Tuấn Anh',
      rating: 4,
      court: manageableCourts[1]?.name || 'Sân thể thao',
      comment: 'Đèn tốt, nhưng cần thông báo sớm hơn khi đổi sân nhỏ.',
    },
  ];

  const statusLabel: Record<string, string> = {
    pending: 'Chờ duyệt',
    confirmed: 'Đã nhận',
    rejected: 'Từ chối',
    cancelled: 'Đã hủy',
    completed: 'Hoàn tất',
  };

  React.useEffect(() => {
    if (!selectedCourt && manageableCourts[0]) {
      setSelectedCourtId(manageableCourts[0].id);
      setSelectedSubCourtId(manageableCourts[0].subCourts[0]?.id || '');
      return;
    }
    if (selectedCourt && !selectedSubCourt && selectedCourt.subCourts[0]) {
      setSelectedSubCourtId(selectedCourt.subCourts[0].id);
    }
  }, [manageableCourts, selectedCourt, selectedSubCourt]);

  const emptyVenueState = (
    <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
      <p className="text-sm font-black text-neutral-700">Bạn chưa có sân nào được duyệt.</p>
      <p className="text-[10px] text-neutral-400 font-semibold mt-1">Gửi yêu cầu thêm sân mới để Admin xét duyệt.</p>
      <button
        onClick={() => setShowCreateVenueModal(true)}
        className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
      >
        <Plus size={14} /> Thêm sân mới
      </button>
    </div>
  );

  return (
    <div className="relative flex flex-col h-full bg-neutral-50 animate-fadeIn">
      <div className="bg-white px-5 pt-8 pb-4 border-b border-neutral-100 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-neutral-850 uppercase tracking-tight">Quản lý sân</h1>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
              {user.role === 'venue_owner' ? 'Chủ sân' : 'Nhân viên vận hành'}
            </p>
          </div>
          {user.role === 'venue_owner' && (
            <button
              onClick={() => setShowCreateVenueModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
            >
              <Plus size={14} /> Thêm sân mới
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1 bg-neutral-100 p-1 rounded-xl">
          {([
            ['dashboard', 'Tổng quan'],
            ['bookings', 'Booking'],
            ['schedule', 'Lịch sân'],
            ['customers', 'Khách'],
          ] as [ManageTab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`py-2 rounded-lg text-[9px] font-black uppercase transition ${
                activeSubTab === tab ? 'bg-white text-emerald-600 shadow-sm' : 'text-neutral-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-5">
        {activeSubTab === 'dashboard' && (
          manageableCourts.length === 0 ? emptyVenueState : (
            <>
              <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Quick action</p>
                  <p className="text-sm font-black text-neutral-800 mt-1">Gửi yêu cầu thêm cụm sân mới cho Admin.</p>
                </div>
                <button
                  onClick={() => setShowCreateVenueModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
                >
                  <Plus size={14} /> Thêm sân mới
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Tổng booking', value: manageableBookings.length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Chờ duyệt', value: pendingBookings.length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Doanh thu ngày', value: formatMoney(dailyRevenue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Lấp đầy sân', value: `${occupancyRate}%`, icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="text-lg font-black text-neutral-850 leading-tight">{item.value}</div>
                      <div className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{item.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-neutral-800 uppercase">Doanh thu</h3>
                  <LayoutDashboard size={16} className="text-neutral-300" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-[9px] font-black text-neutral-400 uppercase">Ngày đang chọn</p>
                    <p className="text-sm font-black text-emerald-600">{formatMoney(dailyRevenue)}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-[9px] font-black text-neutral-400 uppercase">Tháng {monthKey}</p>
                    <p className="text-sm font-black text-neutral-800">{formatMoney(monthlyRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-neutral-800 uppercase">Booking mới</h3>
                  <button
                    onClick={() => setActiveSubTab('bookings')}
                    className="text-[9px] font-black text-emerald-600 uppercase"
                  >
                    Xem tất cả
                  </button>
                </div>
                {manageableBookings.slice(0, 4).map(booking => (
                  <div key={booking.id} className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 first:border-t-0 first:pt-0">
                    <div className="min-w-0">
                      <p className="text-xs font-black text-neutral-800 truncate">{booking.customerName || 'Khách hàng'}</p>
                      <p className="text-[10px] text-neutral-500 font-semibold truncate">{booking.courtName} · {booking.timeSlot}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase shrink-0 ${
                      booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-neutral-100 text-neutral-500'
                    }`}>
                      {statusLabel[booking.status]}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {activeSubTab === 'bookings' && (
          manageableCourts.length === 0 ? emptyVenueState : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Booking dashboard</h3>
              <button
                onClick={() => pendingBookings.forEach(booking => acceptBooking(booking.id))}
                className="px-3 py-2 rounded-xl bg-neutral-900 text-white text-[10px] font-black uppercase"
              >
                Auto-confirm
              </button>
            </div>

            {manageableBookings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
                <Calendar size={28} className="mx-auto text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-neutral-400">Chưa có booking nào.</p>
              </div>
            ) : manageableBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-emerald-600 uppercase truncate">{booking.courtName}</p>
                    <h4 className="text-sm font-black text-neutral-850 truncate">{booking.customerName || 'Khách hàng'}</h4>
                    <p className="text-[10px] text-neutral-500 font-semibold">{booking.date} · {booking.timeSlot} · {formatMoney(booking.price)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                    booking.status === 'rejected' ? 'bg-red-50 text-red-600' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>
                    {statusLabel[booking.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-500 bg-neutral-50 rounded-xl p-3">
                  <span>{booking.subCourtName}</span>
                  <span className="text-right">{booking.customerPhone || 'Chưa có SĐT'}</span>
                </div>

                {booking.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => acceptBooking(booking.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
                    >
                      <CheckCircle2 size={13} /> Accept
                    </button>
                    <button
                      onClick={() => rejectBooking(booking.id)}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          )
        )}

        {activeSubTab === 'schedule' && manageableCourts.length === 0 && emptyVenueState}
        {activeSubTab === 'schedule' && manageableCourts.length > 0 && selectedCourt && selectedSubCourt && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Manage schedule</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold"
              />
              <select
                value={selectedCourt.id}
                onChange={(e) => {
                  const court = manageableCourts.find(c => c.id === e.target.value);
                  setSelectedCourtId(e.target.value);
                  setSelectedSubCourtId(court?.subCourts[0]?.id || '');
                }}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold"
              >
                {manageableCourts.map(court => <option key={court.id} value={court.id}>{court.name}</option>)}
              </select>
              <select
                value={selectedSubCourt.id}
                onChange={(e) => setSelectedSubCourtId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold"
              >
                {selectedCourt.subCourts.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              {(selectedSubCourt.slots[selectedDate] || []).map(slot => {
                const blocked = Boolean(slot.isBlocked);
                return (
                  <div key={slot.id} className="bg-white rounded-2xl border border-neutral-100 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Clock size={15} className={blocked ? 'text-red-500' : 'text-emerald-600'} />
                      <div>
                        <p className="text-xs font-black text-neutral-800">{slot.time}</p>
                        <p className="text-[10px] font-semibold text-neutral-400">
                          {blocked ? 'Blocked' : slot.isBooked ? 'Đã có booking' : `Available · ${formatMoney(slot.price)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSlotAvailability(selectedCourt.id, selectedSubCourt.id, selectedDate, slot.id, blocked || slot.isBooked)}
                      className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase ${
                        blocked || slot.isBooked ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {blocked || slot.isBooked ? 'Mở lại' : 'Block'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'customers' && (
          manageableCourts.length === 0 ? emptyVenueState : (
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Customer management</h3>
              {customers.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
                  <UserRound size={28} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-xs font-bold text-neutral-400">Chưa có dữ liệu khách hàng.</p>
                </div>
              ) : customers.map(customer => (
                <div key={customer.id} className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <UserRound size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-neutral-850 truncate">{customer.name}</p>
                    <p className="text-[10px] text-neutral-500 font-semibold truncate">{customer.phone} · {customer.email}</p>
                    <p className="text-[10px] text-emerald-600 font-black mt-1">{customer.totalBookings} booking · {formatMoney(customer.totalSpend)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Trả lời review</h3>
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-neutral-850">{review.customer}</p>
                      <p className="text-[10px] text-neutral-400 font-semibold">{review.court}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{review.comment}</p>
                  {sentReplies[review.id] ? (
                    <div className="bg-emerald-50 text-emerald-700 rounded-xl p-3 text-[10px] font-bold">
                      Đã trả lời: {sentReplies[review.id]}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={replyTextByReview[review.id] || ''}
                        onChange={(e) => setReplyTextByReview(prev => ({ ...prev, [review.id]: e.target.value }))}
                        placeholder="Nhập phản hồi cho khách..."
                        className="w-full min-h-20 resize-none bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => {
                          const text = replyTextByReview[review.id]?.trim();
                          if (!text) return;
                          setSentReplies(prev => ({ ...prev, [review.id]: text }));
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 text-white text-[10px] font-black uppercase"
                      >
                        <MessageSquare size={13} /> Gửi phản hồi
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )
        )}

        {activeSubTab === 'schedule' && selectedCourt && (
          <div className="space-y-3">
            <h3 className="text-sm font-black text-neutral-800 uppercase">Danh sách sân</h3>
            {manageableCourts.slice(0, 4).map(court => (
              <div key={court.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                <SafeImage src={court.imageUrl} fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800" sportType={court.sport} alt={court.name} className="w-full h-24 object-cover" />
                <div className="p-3">
                  <p className="text-xs font-black text-neutral-800">{court.name}</p>
                  <p className="text-[10px] text-neutral-400 font-bold">{court.subCourts.length} sân nhỏ · từ {formatMoney(court.priceMin)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateVenueModal && (
        <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 shadow-2xl p-4 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Thêm sân mới</h3>
              <button
                onClick={() => setShowCreateVenueModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-500 font-black"
              >
                ×
              </button>
            </div>

            <input value={requestForm.name} onChange={(e) => setRequestForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Tên sân/cụm sân" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            <input value={requestForm.address} onChange={(e) => setRequestForm(prev => ({ ...prev, address: e.target.value }))} placeholder="Địa chỉ" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            <input value={requestForm.district} onChange={(e) => setRequestForm(prev => ({ ...prev, district: e.target.value }))} placeholder="Khu vực/quận" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            <div className="grid grid-cols-2 gap-2">
              <input value={requestForm.pricePerHour} onChange={(e) => setRequestForm(prev => ({ ...prev, pricePerHour: e.target.value }))} placeholder="Giá theo giờ" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
              <select value={requestForm.sport} onChange={(e) => setRequestForm(prev => ({ ...prev, sport: e.target.value as SportType }))} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold">
                {SPORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input value={requestForm.openingHour} onChange={(e) => setRequestForm(prev => ({ ...prev, openingHour: e.target.value }))} type="time" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
              <input value={requestForm.closingHour} onChange={(e) => setRequestForm(prev => ({ ...prev, closingHour: e.target.value }))} type="time" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            </div>
            <input value={requestForm.closedDays} onChange={(e) => setRequestForm(prev => ({ ...prev, closedDays: e.target.value }))} placeholder="Ngày nghỉ" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            <input value={requestForm.imageUrl} onChange={(e) => setRequestForm(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="Ảnh sân (URL)" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />
            <textarea value={requestForm.description} onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Mô tả ngắn" className="w-full min-h-24 resize-none bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold" />

            <button
              onClick={() => {
                if (!requestForm.name.trim() || !requestForm.address.trim() || !requestForm.district.trim()) return;
                submitVenueRequest({
                  name: requestForm.name.trim(),
                  address: requestForm.address.trim(),
                  district: requestForm.district.trim(),
                  sport: requestForm.sport,
                  pricePerHour: Number(requestForm.pricePerHour) || 0,
                  openingHour: requestForm.openingHour,
                  closingHour: requestForm.closingHour,
                  closedDays: requestForm.closedDays.trim() || 'Không',
                  description: requestForm.description.trim(),
                  imageUrl: requestForm.imageUrl.trim(),
                });
                setShowCreateVenueModal(false);
                setRequestForm({
                  name: '',
                  address: '',
                  district: '',
                  sport: 'soccer',
                  pricePerHour: '200000',
                  openingHour: '05:00',
                  closingHour: '22:00',
                  closedDays: 'Không',
                  description: '',
                  imageUrl: '',
                });
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
            >
              <Plus size={14} /> Gửi yêu cầu duyệt sân
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
