import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  Plus,
  Pencil,
  Save,
  Star,
  Trash2,
  TrendingUp,
  UserRound,
  Wrench,
} from 'lucide-react';
import { useSport } from '../context/SportContext';
import { CourtSchedule, SportType } from '../types';

type ManageTab = 'dashboard' | 'courts' | 'bookings' | 'schedule' | 'customers';

const formatMoney = (value: number) => `${value.toLocaleString('vi-VN')}đ`;

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
    ownerDashboardStats,
    selectedDate,
    setSelectedDate,
    refreshOwnerDashboardStats,
    loadOwnerSchedule,
    saveOwnerSchedule,
    updateOwnerSlotStatus,
    createOwnerCourt,
    updateOwnerCourt,
    deleteOwnerCourt,
  } = useSport();

  const [activeSubTab, setActiveSubTab] = useState<ManageTab>('dashboard');
  const [selectedCourtId, setSelectedCourtId] = useState('');
  const [selectedSubCourtId, setSelectedSubCourtId] = useState('');
  const [replyTextByReview, setReplyTextByReview] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [courtMessage, setCourtMessage] = useState('');
  const [courtForm, setCourtForm] = useState({
    venueId: '',
    name: '',
    sport: 'soccer' as Exclude<SportType, 'all'>,
    pricePerHour: '0',
    status: 'open' as 'open' | 'closed' | 'maintenance',
    description: '',
  });
  const [scheduleForm, setScheduleForm] = useState<Omit<CourtSchedule, 'courtId' | 'date' | 'slots'>>({
    openingTime: '06:00',
    closingTime: '22:00',
    slotDuration: 60,
    status: 'open',
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState('');
  const manageableCourts = user.role === 'venue_owner'
    ? courts.filter(court => court.ownerId === user.id)
    : courts;
  const manageableBookings = user.role === 'venue_owner'
    ? bookings.filter(booking => booking.ownerId === user.id || manageableCourts.some(court => court.id === booking.courtId))
    : bookings;

  const selectedCourt = manageableCourts.find(c => c.id === selectedCourtId) || manageableCourts[0];
  const selectedSubCourt = selectedCourt?.subCourts.find(s => s.id === selectedSubCourtId) || selectedCourt?.subCourts[0];
  const allPhysicalCourts = manageableCourts.flatMap(venue =>
    venue.subCourts.map(court => ({ venue, court })));
  const today = new Date().toISOString().slice(0, 10);

  const openCourtModal = (venueId?: string, courtId?: string) => {
    const existing = courtId ? allPhysicalCourts.find(item => item.court.id === courtId) : undefined;
    setEditingCourtId(courtId || null);
    setCourtMessage('');
    setCourtForm({
      venueId: existing?.venue.id || venueId || manageableCourts[0]?.id || '',
      name: existing?.court.name || '',
      sport: (existing?.court.sport || existing?.venue.sport || 'soccer') as Exclude<SportType, 'all'>,
      pricePerHour: String(existing?.court.pricePerHour || 0),
      status: existing?.court.status || 'open',
      description: existing?.court.description || '',
    });
    setShowCourtModal(true);
  };

  const saveCourt = async () => {
    if (!courtForm.venueId || !courtForm.name.trim()) return;
    setCourtMessage('');
    try {
      const payload = {
        name: courtForm.name.trim(),
        sport: courtForm.sport,
        pricePerHour: Number(courtForm.pricePerHour) || 0,
        status: courtForm.status,
        description: courtForm.description.trim(),
      };
      if (editingCourtId) await updateOwnerCourt(editingCourtId, payload);
      else await createOwnerCourt({ venueId: courtForm.venueId, ...payload });
      setShowCourtModal(false);
      setCourtMessage(editingCourtId ? 'Đã cập nhật thông tin và giá sân.' : 'Đã tạo sân mới.');
    } catch (error: any) {
      setCourtMessage(error.message || 'Không thể lưu sân.');
    }
  };

  const changeCourtStatus = async (
    court: typeof allPhysicalCourts[number]['court'],
    status: 'open' | 'closed' | 'maintenance',
  ) => {
    setCourtMessage('');
    try {
      await updateOwnerCourt(court.id, {
        name: court.name,
        sport: (court.sport || 'soccer') as Exclude<SportType, 'all'>,
        pricePerHour: court.pricePerHour || 0,
        status,
        description: court.description,
      });
    } catch (error: any) {
      setCourtMessage(error.message || 'Không thể cập nhật trạng thái sân.');
    }
  };

  const customers = useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      phone: string;
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
    pending_payment_verification: 'Chờ xác minh TT',
    confirmed: 'Đã nhận',
    payment_rejected: 'TT bị từ chối',
    cancelled: 'Đã hủy',
    completed: 'Hoàn tất',
  };

  React.useEffect(() => {
    if (activeSubTab !== 'dashboard') return;
    refreshOwnerDashboardStats().catch(error => console.error('[owner:dashboard-stats]', error));
  }, [activeSubTab]);

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

  React.useEffect(() => {
    if (activeSubTab !== 'schedule' || !selectedCourt || !selectedSubCourt) return;
    let active = true;
    setScheduleLoading(true);
    setScheduleMessage('');
    loadOwnerSchedule(selectedCourt.id, selectedSubCourt.id, selectedDate)
      .then(schedule => {
        if (!active) return;
        setScheduleForm({
          openingTime: schedule.openingTime,
          closingTime: schedule.closingTime,
          slotDuration: schedule.slotDuration,
          status: schedule.status,
        });
      })
      .catch(error => active && setScheduleMessage(error.message || 'Không thể tải lịch sân.'))
      .finally(() => active && setScheduleLoading(false));
    return () => {
      active = false;
    };
  }, [activeSubTab, selectedCourt?.id, selectedSubCourt?.id, selectedDate]);

  const currentSchedule = selectedSubCourt ? {
    courtId: selectedSubCourt.id,
    date: selectedDate,
    ...scheduleForm,
    slots: selectedSubCourt.slots[selectedDate] || [],
  } as CourtSchedule : null;

  const persistSchedule = async (generate: boolean) => {
    if (!selectedCourt || !currentSchedule) return;
    setScheduleLoading(true);
    setScheduleMessage('');
    try {
      const saved = await saveOwnerSchedule(selectedCourt.id, currentSchedule, generate);
      setScheduleForm({
        openingTime: saved.openingTime,
        closingTime: saved.closingTime,
        slotDuration: saved.slotDuration,
        status: saved.status,
      });
      setScheduleMessage(generate ? 'Đã tạo và lưu các khung giờ.' : 'Đã lưu cấu hình lịch sân.');
    } catch (error: any) {
      setScheduleMessage(error.message || 'Không thể lưu lịch sân.');
    } finally {
      setScheduleLoading(false);
    }
  };

  const emptyVenueState = (
    <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
      <p className="text-sm font-black text-neutral-700">Tài khoản chưa được gắn với cơ sở nào.</p>
      <p className="text-[10px] text-neutral-400 font-semibold mt-1">Vui lòng liên hệ Admin SportRes để được hỗ trợ.</p>
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
              onClick={() => openCourtModal()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase"
            >
              <Plus size={14} /> Thêm sân
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1 bg-neutral-100 p-1 rounded-xl">
          {([
            ['dashboard', 'Tổng quan'],
            ['courts', 'Quản lý sân'],
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
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Tổng booking', value: ownerDashboardStats.totalBookings, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
                  { label: 'Chờ duyệt', value: ownerDashboardStats.pendingBookings, icon: Clock, color: 'bg-amber-50 text-amber-600' },
                  { label: 'Doanh thu hôm nay', value: formatMoney(ownerDashboardStats.todayRevenue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Doanh thu tháng này', value: formatMoney(ownerDashboardStats.monthlyRevenue), icon: DollarSign, color: 'bg-teal-50 text-teal-600' },
                  { label: 'Lấp đầy sân', value: `${ownerDashboardStats.occupancyRate}%`, icon: TrendingUp, color: 'bg-violet-50 text-violet-600' },
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
                  <h3 className="text-xs font-black text-neutral-800 uppercase">Trạng thái sân</h3>
                  <button onClick={() => setActiveSubTab('courts')} className="text-[9px] font-black text-emerald-600 uppercase">Quản lý</button>
                </div>
                {allPhysicalCourts.length === 0 ? (
                  <p className="text-[10px] text-neutral-400 font-semibold">Chưa có sân con. Hãy tạo Sân 1, Sân 2...</p>
                ) : allPhysicalCourts.map(({ venue, court }) => (
                  <div key={court.id} className="border-t border-neutral-100 pt-3 first:border-t-0 first:pt-0 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-neutral-800">{court.name}</p>
                      <p className="text-[9px] text-neutral-400 font-semibold">
                        {venue.name} · {court.status === 'open'
                          ? `${court.openingTime || '06:00'}–${court.closingTime || '22:00'}`
                          : 'Không nhận đặt sân'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                      court.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                      court.status === 'maintenance' ? 'bg-amber-50 text-amber-600' :
                      'bg-neutral-100 text-neutral-500'
                    }`}>
                      {court.status === 'open' ? 'Hoạt động' : court.status === 'maintenance' ? 'Bảo trì' : 'Tạm đóng'}
                    </span>
                  </div>
                ))}
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
                      booking.status === 'pending_payment_verification' ? 'bg-amber-50 text-amber-600' :
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

        {activeSubTab === 'courts' && (
          manageableCourts.length === 0 ? emptyVenueState : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-neutral-800 uppercase">Quản lý sân</h3>
                  <p className="text-[9px] text-neutral-400 font-semibold">Tạo và quản lý từng sân thuộc cơ sở.</p>
                </div>
                <button onClick={() => openCourtModal()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase">
                  <Plus size={14} /> Thêm sân
                </button>
              </div>
              {allPhysicalCourts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
                  <p className="text-sm font-black text-neutral-700">Cơ sở chưa có sân nào.</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Tạo Sân 1, Sân 2, Sân 3 để bắt đầu cấu hình lịch.</p>
                  <button onClick={() => openCourtModal()} className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black">+ Tạo sân đầu tiên</button>
                </div>
              ) : allPhysicalCourts.map(({ venue, court }) => {
                const bookingsToday = manageableBookings.filter(booking => booking.subCourtId === court.id && booking.date === today).length;
                return (
                  <div key={court.id} className="bg-white rounded-2xl border border-neutral-100 p-4 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[9px] text-emerald-600 font-black uppercase">{venue.name}</p>
                        <h4 className="text-sm font-black text-neutral-850">{court.name}</h4>
                        <p className="text-[10px] text-neutral-400 font-semibold mt-1">{court.openingTime || '06:00'}–{court.closingTime || '22:00'} · {formatMoney(court.pricePerHour || 0)}/giờ</p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                        court.status === 'open' ? 'bg-emerald-50 text-emerald-600' :
                        court.status === 'maintenance' ? 'bg-amber-50 text-amber-600' :
                        'bg-neutral-100 text-neutral-500'
                      }`}>
                        {court.status === 'open' ? 'Hoạt động' : court.status === 'maintenance' ? 'Bảo trì' : 'Tạm đóng'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-neutral-50 rounded-xl p-3 text-[10px] font-semibold text-neutral-500">
                      <span>Booking hôm nay</span><span className="text-right font-black text-neutral-800">{bookingsToday}</span>
                      <span>Thời lượng slot</span><span className="text-right">{court.slotDuration || 60} phút</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => openCourtModal(venue.id, court.id)} className="py-2 rounded-xl bg-blue-50 text-blue-600 text-[9px] font-black flex items-center justify-center gap-1"><Pencil size={12} /> Chỉnh sửa</button>
                      <button onClick={() => { setSelectedCourtId(venue.id); setSelectedSubCourtId(court.id); setActiveSubTab('schedule'); }} className="py-2 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black flex items-center justify-center gap-1"><Calendar size={12} /> Lịch sân</button>
                      <button
                        onClick={() => changeCourtStatus(court, court.status === 'closed' ? 'open' : 'closed')}
                        className="py-2 rounded-xl bg-neutral-100 text-neutral-600 text-[9px] font-black flex items-center justify-center gap-1"
                      >
                        <Clock size={12} /> {court.status === 'closed' ? 'Mở sân' : 'Khóa sân'}
                      </button>
                      <button
                        onClick={() => changeCourtStatus(court, court.status === 'maintenance' ? 'open' : 'maintenance')}
                        className="py-2 rounded-xl bg-amber-50 text-amber-600 text-[9px] font-black flex items-center justify-center gap-1"
                      >
                        <Wrench size={12} /> {court.status === 'maintenance' ? 'Kết thúc bảo trì' : 'Bảo trì'}
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm(`Xóa ${court.name}? Chỉ sân chưa có booking mới có thể xóa.`)) return;
                          try { await deleteOwnerCourt(court.id); }
                          catch (error: any) { setCourtMessage(error.message || 'Không thể xóa sân.'); }
                        }}
                        className="col-span-2 py-2 rounded-xl bg-red-50 text-red-600 text-[9px] font-black flex items-center justify-center gap-1"
                      ><Trash2 size={12} /> Xóa</button>
                    </div>
                  </div>
                );
              })}
              {courtMessage && <p className={`text-[10px] font-bold rounded-xl p-3 ${courtMessage.startsWith('Đã') ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>{courtMessage}</p>}
            </div>
          )
        )}

        {activeSubTab === 'bookings' && (
          manageableCourts.length === 0 ? emptyVenueState : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase">Booking dashboard</h3>
              <span className="px-3 py-2 rounded-xl bg-neutral-100 text-neutral-500 text-[10px] font-black uppercase">
                Admin xác minh thanh toán
              </span>
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
                    booking.status === 'pending_payment_verification' ? 'bg-amber-50 text-amber-600' :
                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                    booking.status === 'payment_rejected' ? 'bg-red-50 text-red-600' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>
                    {statusLabel[booking.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-neutral-500 bg-neutral-50 rounded-xl p-3">
                  <span>{booking.subCourtName}</span>
                  <span className="text-right">{booking.customerPhone || 'Chưa có SĐT'}</span>
                </div>

              </div>
            ))}
          </div>
          )
        )}

        {activeSubTab === 'schedule' && manageableCourts.length === 0 && emptyVenueState}
        {activeSubTab === 'schedule' && manageableCourts.length > 0 && selectedCourt && selectedSubCourt && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-neutral-800 uppercase">Chỉnh sửa lịch sân</h3>
                  <p className="text-[9px] text-neutral-400 font-bold mt-0.5">Thiết lập giờ hoạt động và trạng thái từng khung giờ.</p>
                </div>
                <Calendar size={18} className="text-emerald-500" />
              </div>

              <label className="text-[9px] font-black uppercase text-neutral-400">
                Cụm sân
                <select
                  value={selectedCourt.id}
                  onChange={(e) => {
                    const court = manageableCourts.find(c => c.id === e.target.value);
                    setSelectedCourtId(e.target.value);
                    setSelectedSubCourtId(court?.subCourts[0]?.id || '');
                  }}
                  className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700"
                >
                  {manageableCourts.map(court => <option key={court.id} value={court.id}>{court.name}</option>)}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Sân
                  <select value={selectedSubCourt.id} onChange={(e) => setSelectedSubCourtId(e.target.value)} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700">
                    {selectedCourt.subCourts.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                  </select>
                </label>
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Ngày
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700" />
                </label>
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Giờ mở cửa
                  <input type="time" value={scheduleForm.openingTime} onChange={e => setScheduleForm(prev => ({ ...prev, openingTime: e.target.value }))} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700" />
                </label>
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Giờ đóng cửa
                  <input type="time" value={scheduleForm.closingTime} onChange={e => setScheduleForm(prev => ({ ...prev, closingTime: e.target.value }))} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700" />
                </label>
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Thời lượng
                  <select value={scheduleForm.slotDuration} onChange={e => setScheduleForm(prev => ({ ...prev, slotDuration: Number(e.target.value) as 30 | 60 | 90 | 120 }))} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700">
                    {[30, 60, 90, 120].map(duration => <option key={duration} value={duration}>{duration} phút</option>)}
                  </select>
                </label>
                <label className="text-[9px] font-black uppercase text-neutral-400">
                  Trạng thái sân
                  <select value={scheduleForm.status} onChange={e => setScheduleForm(prev => ({ ...prev, status: e.target.value as CourtSchedule['status'] }))} className="mt-1 w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-700">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button disabled={scheduleLoading} onClick={() => persistSchedule(false)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neutral-900 text-white text-[9px] font-black uppercase disabled:opacity-50">
                  <Save size={13} /> Save Schedule
                </button>
                <button disabled={scheduleLoading} onClick={() => persistSchedule(true)} className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-[9px] font-black uppercase disabled:opacity-50">
                  <Plus size={13} /> Generate Slots
                </button>
              </div>
              {scheduleMessage && <p className="text-[10px] font-bold text-center text-emerald-600">{scheduleMessage}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-neutral-800 uppercase">Khung giờ trong ngày</h3>
                <span className="text-[9px] font-bold text-neutral-400">{(selectedSubCourt.slots[selectedDate] || []).length} slots</span>
              </div>
              {(selectedSubCourt.slots[selectedDate] || []).map(slot => {
                const blocked = Boolean(slot.isBlocked);
                const maintenance = Boolean(slot.isMaintenance);
                return (
                  <div key={slot.id} className="bg-neutral-50 rounded-xl border border-neutral-100 p-3 space-y-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {maintenance ? <Wrench size={15} className="text-amber-500" /> : <Clock size={15} className={blocked ? 'text-neutral-400' : slot.isBooked ? 'text-red-500' : 'text-emerald-600'} />}
                      <div className="flex-1">
                        <p className="text-xs font-black text-neutral-800">{slot.time}</p>
                        <p className="text-[10px] font-semibold text-neutral-400">
                          {slot.isBooked ? 'Booked' : maintenance ? 'Maintenance' : blocked ? 'Locked / Closed' : `Available · ${formatMoney(slot.price > 0 ? slot.price : selectedSubCourt.pricePerHour || 0)}`}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${
                        slot.isBooked ? 'bg-red-50 text-red-600' : maintenance ? 'bg-amber-50 text-amber-600' : blocked ? 'bg-neutral-200 text-neutral-500' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {slot.isBooked ? 'Booked' : maintenance ? 'Maintenance' : blocked ? 'Locked' : 'Available'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['available', 'locked', 'maintenance'] as const).map(status => (
                        <button
                          key={status}
                          disabled={slot.isBooked || scheduleLoading}
                          onClick={async () => {
                            setScheduleLoading(true);
                            setScheduleMessage('');
                            try {
                              await updateOwnerSlotStatus(selectedCourt.id, selectedSubCourt.id, selectedDate, slot.id, status);
                            } catch (error: any) {
                              setScheduleMessage(error.message || 'Không thể cập nhật slot.');
                            } finally {
                              setScheduleLoading(false);
                            }
                          }}
                          className={`py-2 rounded-lg text-[8px] font-black uppercase disabled:opacity-40 ${
                            status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                            status === 'locked' ? 'bg-neutral-200 text-neutral-600' :
                            'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {status === 'available' ? 'Unlock' : status === 'locked' ? 'Lock' : 'Maintenance'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {!scheduleLoading && (selectedSubCourt.slots[selectedDate] || []).length === 0 && (
                <div className="py-8 text-center border border-dashed border-neutral-200 rounded-xl">
                  <Clock size={24} className="mx-auto text-neutral-300 mb-2" />
                  <p className="text-[10px] font-bold text-neutral-400">Chưa có khung giờ. Chọn cấu hình và nhấn Generate Slots.</p>
                </div>
              )}
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
                    <p className="text-[10px] text-neutral-500 font-semibold truncate">{customer.phone}</p>
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

      </div>

      {showCourtModal && (
        <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-4 z-50">
          <div className="w-full max-w-md bg-white rounded-3xl border border-neutral-100 shadow-2xl p-4 space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-neutral-800 uppercase">{editingCourtId ? 'Chỉnh sửa sân' : 'Thêm sân'}</h3>
              <button onClick={() => setShowCourtModal(false)} className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-500 font-black">×</button>
            </div>
            {!editingCourtId && (
              <select value={courtForm.venueId} onChange={e => setCourtForm(prev => ({ ...prev, venueId: e.target.value }))} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold">
                {manageableCourts.map(venue => <option key={venue.id} value={venue.id}>{venue.name}</option>)}
              </select>
            )}
            <input value={courtForm.name} onChange={e => setCourtForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Tên sân, ví dụ: Sân 1" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold" />
            <div className="grid grid-cols-2 gap-2">
              <select value={courtForm.sport} onChange={e => setCourtForm(prev => ({ ...prev, sport: e.target.value as Exclude<SportType, 'all'> }))} className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold">
                {SPORT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input type="number" min="0" value={courtForm.pricePerHour} onChange={e => setCourtForm(prev => ({ ...prev, pricePerHour: e.target.value }))} placeholder="Giá/giờ" className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold" />
            </div>
            <select value={courtForm.status} onChange={e => setCourtForm(prev => ({ ...prev, status: e.target.value as typeof courtForm.status }))} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold">
              <option value="open">Hoạt động</option>
              <option value="closed">Tạm đóng</option>
              <option value="maintenance">Bảo trì</option>
            </select>
            <textarea value={courtForm.description} onChange={e => setCourtForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Mô tả (tùy chọn)" className="w-full min-h-20 resize-none bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs font-semibold" />
            {courtMessage && <p className="text-[10px] font-bold text-red-600 bg-red-50 rounded-xl p-3">{courtMessage}</p>}
            <button onClick={saveCourt} className="w-full py-3 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase">
              {editingCourtId ? 'Lưu thay đổi' : 'Tạo sân'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
