import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { SportType } from '../types';
import { CreditCard, Wallet, Plus, Star, Trophy, Users, ChevronRight, Sparkles, ShoppingCart, Bell, TicketPercent, MapPin } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { NotificationsOverlay } from './NotificationsOverlay';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  setSportFilter: (sport: SportType) => void;
  onOpenAi: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab, setSportFilter, onOpenAi }) => {
  const { user, courts, matches, depositWallet, joinMatchID, setSelectedCourtId, setSelectedMatchId } = useSport();
  const [depositAmount, setDepositAmount] = useState<string>('100000');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleDeposit = () => {
    const val = parseInt(depositAmount);
    if (isNaN(val) || val <= 0) return;
    depositWallet(val);
    setShowDepositModal(false);
    setSuccessMsg(`Nạp thành công +${val.toLocaleString('vi-VN')}đ vào Ví SportRes MoMo!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleQuickJoinMatch = (matchId: string) => {
    const res = joinMatchID(matchId);
    if (res.success) {
      setSuccessMsg('Tuyệt vời! Bạn đã ghép kèo thành công. Hãy tới sân đúng giờ nhé!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } else {
      setErrorMsg(res.error || 'Ghép cặp thất bại.');
      setTimeout(() => setErrorMsg(null), 3500);
    }
  };

  const handleSeeMoreCourt = (courtId: string, sport: SportType) => {
    setSelectedCourtId(courtId);
    setSportFilter(sport);
    setActiveTab('booking');
  };

  const handleSeeMoreMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setActiveTab('matchmaking');
  };

  // Filter personalized matches based on user favorite sports ("soccer", "badminton" etc.)
  // and prioritize matching the user's preferred skill level (Advanced / Intermediate)
  const personalizedMatches = matches.filter(m => {
    const isPreferredSport = user.favoriteSports.includes(m.sport);
    return isPreferredSport && m.status === 'open';
  }).slice(0, 2);

  return (
    <div id="home-tab-content" className="flex-1 flex flex-col overflow-hidden select-none bg-neutral-50 text-neutral-800 relative">
      {showNotifications ? (
        <NotificationsOverlay onClose={() => setShowNotifications(false)} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24 scrollbar-none animate-fadeIn">
          
          {/* Dynamic Success Toast */}
          {successMsg && (
            <div id="success-toast" className="absolute top-[90px] left-1/2 -translate-x-1/2 w-80 bg-emerald-600 text-white p-3 rounded-xl shadow-2xl text-xs font-black text-center z-50 flex items-center justify-center gap-2 animate-bounce border border-emerald-400">
              <span>✔️</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dynamic Error Toast */}
          {errorMsg && (
            <div id="error-toast" className="absolute top-[90px] left-1/2 -translate-x-1/2 w-80 bg-red-600 text-white p-3 rounded-xl shadow-2xl text-xs font-black text-center z-50 flex items-center justify-center gap-2 animate-bounce border border-red-400">
              <span>❌</span>
              <span>{errorMsg}</span>
            </div>
          )}

      {/* 1. Welcome Header (Mirroring the screenshot) */}
      <div className="flex justify-between items-center bg-transparent pt-1">
        <div className="flex items-center gap-3">
          <div className="relative">
            <SafeImage
              src={user.avatar}
              fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
              alt={user.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs bg-neutral-200"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 font-extrabold block tracking-tight">Chào buổi sáng,</span>
            <h2 className="text-sm font-black text-neutral-800 leading-tight">{user.name}</h2>
          </div>
        </div>

        {/* Right Bell notification icon opening the official notifications overlay */}
        <button
          onClick={() => setShowNotifications(true)}
          className="w-10 h-10 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center relative cursor-pointer"
        >
          <Bell size={18} />
          {/* Notification red badged indicator */}
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* SportRes AI assistant Prominent Action Banner */}
      <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl p-3.5 shadow-md border border-emerald-400/20 text-left relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl"></div>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="text-[8px] bg-white/20 text-white px-2 py-0.5 rounded font-black font-mono tracking-widest uppercase">
              SPORTRES CO-PILOT
            </span>
            <h3 className="text-xs font-black text-white leading-tight">SportRes AI đang trực tuyến!</h3>
            <p className="text-[9.5px] text-white/90 leading-tight">Đề xuất sân trống Thạch Thất hôm nay & ghép kèo phù hợp với trình của bạn.</p>
          </div>
          <button
            onClick={onOpenAi}
            className="bg-white text-emerald-800 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-md hover:bg-neutral-100 transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Sparkles size={11} className="text-emerald-600 animate-pulse" />
            Hỏi AI
          </button>
        </div>
      </div>

      {/* 3. Deep court deals section (Ưu đãi sân bóng) */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-4 shadow-md space-y-3.5 text-left">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <TicketPercent size={15} className="text-emerald-500" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400 font-sans">Ưu đãi sân bóng</span>
          </div>
          <button
            onClick={() => setActiveTab('booking')}
            className="text-[10px] font-extrabold text-emerald-600 flex items-center cursor-pointer hover:underline font-sans"
          >
            Xem tất cả
          </button>
        </div>

        {/* Responsive Grid Container (3-column layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pr-1">
          {courts.slice(0, 3).map((court, index) => {
            const discountPercent = index % 3 === 0 ? 40 : index % 3 === 1 ? 25 : 15;
            const originalPriceDecimal = court.priceMin / (1 - discountPercent / 100);
            const originalPrice = Math.ceil(originalPriceDecimal / 10000) * 10000;
            const rating = court.rating || (4.5 + (index % 5) * 0.1);

            return (
              <div 
                key={court.id}
                className="w-full bg-white rounded-3xl border border-neutral-200/50 transition-all duration-200 relative overflow-hidden flex flex-col hover:shadow-md shadow-2xs text-left group"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <SafeImage
                    src={court.imageUrl}
                    fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800"
                    sportType={court.sport}
                    alt={court.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Discount Percentage Badge (Top Left) */}
                  <span className="absolute top-3.5 left-3.5 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg z-10 shadow-sm uppercase tracking-wider">
                    -{discountPercent}% OFF
                  </span>
                  {/* Star Rating Badge (Top Right) */}
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs text-neutral-800 font-bold px-2 py-0.5 rounded-lg text-[9.5px] flex items-center gap-0.5 shadow-xs z-10">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Text content & pricing info */}
                <div className="p-4 flex flex-col gap-2 bg-white">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-[13px] font-black text-neutral-800 leading-snug truncate">
                      {court.name}
                    </h4>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[9px] text-neutral-400 line-through leading-none">
                        {originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-emerald-600 text-[12.5px] font-black leading-tight mt-0.5">
                        {court.priceMin.toLocaleString('vi-VN')}đ<span className="text-[8.5px] font-medium text-neutral-400">/g</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-neutral-100 pt-2.5 mt-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium truncate max-w-[70%]">
                      <MapPin size={10} className="text-neutral-400 shrink-0" />
                      <span className="truncate">{court.address}</span>
                    </div>

                    {/* Redirect CTA style button matching Shopping Cart design but simpler */}
                    <button
                      onClick={() => handleSeeMoreCourt(court.id, court.sport)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-600 rounded-full flex items-center justify-center gap-1 cursor-pointer transition active:scale-95 border border-emerald-250/10 shrink-0 text-[10px] font-extrabold"
                      title="Xem thông tin sân"
                    >
                      <span>Xem thêm</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Personalized matchmaking section (Kèo ghép trận tiêu biểu cùng trình độ và môn thể thao được cá nhân hóa sẵn từ người dùng) */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 p-4 shadow-md space-y-4 text-left">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-amber-500" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">Kèo đấu cá nhân hóa</span>
          </div>
          <button
            onClick={() => setActiveTab('matchmaking')}
            className="text-[10px] font-extrabold text-emerald-600 flex items-center cursor-pointer hover:underline"
          >
            Đến trận đấu
          </button>
        </div>

        <div className="space-y-3">
          {personalizedMatches.map(m => (
            <div
              key={m.id}
              className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/40 shadow-2xs flex flex-col gap-2.5 text-left"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-base shrink-0">
                    {m.sport === 'soccer' ? '⚽' : '🏸'}
                  </span>
                  <div>
                    <h4 className="text-[11.5px] font-black text-neutral-800 leading-tight line-clamp-1">{m.title}</h4>
                    <p className="text-[9px] text-neutral-400 font-semibold">{m.courtName}</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                  Đúng Trình Độ
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-200/50">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="text-neutral-700">Trình: {user.skillLevels[m.sport] || m.level}</span>
                  <span>•</span>
                  <span className="text-emerald-600">{m.pricePerPlayer.toLocaleString('vi-VN')}đ/vé</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] text-neutral-400 font-semibold">Còn {m.maxPlayers - m.players.length} slot</span>
                  <button
                    onClick={() => handleSeeMoreMatch(m.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold cursor-pointer transition shadow-2xs"
                  >
                    Xem thêm
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        </div>
      )}

      {/* Deposit Cash Modal */}
      {showDepositModal && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-55 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm p-4 shadow-2xl border border-neutral-100 space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
              <h3 className="text-xs font-black text-neutral-800 uppercase flex items-center gap-1">
                <Wallet size={14} className="text-emerald-600" /> Nạp tiền ví SportRes
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-neutral-400 hover:text-neutral-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wide block">Chọn hoặc nhập số tiền (VND):</label>
              
              <div className="grid grid-cols-3 gap-2">
                {['50000', '100000', '200000', '500000', '1000000'].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(amt)}
                    className={`py-2 text-[10px] font-bold border rounded-xl transition cursor-pointer ${
                      depositAmount === amt ? 'bg-emerald-500 border-emerald-500 text-neutral-950 font-black' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {parseInt(amt).toLocaleString('vi-VN')}đ
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={depositAmount}
                onChange={e => setDepositAmount(e.target.value)}
                className="w-full text-center py-2.5 text-base font-black border border-neutral-200 bg-neutral-50 rounded-xl focus:outline-emerald-500 text-neutral-800"
                placeholder="Nhập số tiền tự do..."
              />
            </div>

            <p className="text-[9px] text-neutral-400 text-center leading-relaxed">
              Thanh toán trực tuyến bảo mật được liên kết với ví điện tử MoMo cá nhân của bạn.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-grow py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeposit}
                className="flex-grow py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-md"
              >
                Xác nhận nạp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
