import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { SportType } from '../types';
import { Star, Sparkles, Bell, TicketPercent, MapPin } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { NotificationsOverlay } from './NotificationsOverlay';
import { getVenueCardImage } from '../utils/venueImages';

interface HomeTabProps {
  setActiveTab: (tab: string) => void;
  setSportFilter: (sport: SportType) => void;
  onOpenAi: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab, setSportFilter, onOpenAi }) => {
  const { user, courts, notifications, setSelectedCourtId } = useSport();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

  const handleSeeMoreCourt = (courtId: string, sport: SportType) => {
    setSelectedCourtId(courtId);
    setSportFilter(sport);
    setActiveTab('booking');
  };

  return (
    <div id="home-tab-content" className="flex-1 flex flex-col overflow-hidden select-none bg-neutral-50 text-neutral-800 relative">
      {showNotifications ? (
        <NotificationsOverlay onClose={() => setShowNotifications(false)} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-24 scrollbar-none animate-fadeIn">
          
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
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full border border-white text-[8px] font-black flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
      </div>

      {/* SportRes AI assistant Prominent Action Banner */}
      <button
        type="button"
        onClick={onOpenAi}
        className="w-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-2xl p-3.5 shadow-md border border-emerald-400/20 text-left relative overflow-hidden cursor-pointer hover:shadow-lg active:scale-[0.99] transition"
      >
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl"></div>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="text-[8px] bg-white/20 text-white px-2 py-0.5 rounded font-black font-mono tracking-widest uppercase">
              SPORTRES CO-PILOT
            </span>
            <h3 className="text-xs font-black text-white leading-tight">SportRes AI đang trực tuyến!</h3>
            <p className="text-[9.5px] text-white/90 leading-tight">Đề xuất sân trống Thạch Thất hôm nay & ghép kèo phù hợp với trình của bạn.</p>
          </div>
          <span
            className="bg-white text-emerald-800 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-md flex items-center gap-1 shrink-0"
          >
            <Sparkles size={11} className="text-emerald-600 animate-pulse" />
            Hỏi AI
          </span>
        </div>
      </button>

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
            const cardImage = getVenueCardImage(court);
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
                    src={cardImage}
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

        </div>
      )}

    </div>
  );
};
