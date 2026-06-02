import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { SportType } from '../types';
import { Trophy, Award, TrendingUp, Calendar, MapPin, Users, Flame, Star, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';

export const CommunityTab: React.FC = () => {
  const { tournaments, leaderboards } = useSport();
  const [subView, setSubView] = useState<'ranking' | 'tournaments'>('tournaments');
  const [selectedSport, setSelectedSport] = useState<SportType>('soccer');
  const [selectedTourId, setSelectedTourId] = useState<string | null>('tour-1');

  const sportsConfig = [
    { id: 'badminton' as SportType, name: 'Cầu lông', icon: '🏸' },
    { id: 'soccer' as SportType, name: 'Bóng đá', icon: '⚽' },
    { id: 'pickleball' as SportType, name: 'Pickleball', icon: '🏓' },
    { id: 'tennis' as SportType, name: 'Quần vợt', icon: '🎾' },
    { id: 'volleyball' as SportType, name: 'Bóng chuyền', icon: '🏐' },
    { id: 'basketball' as SportType, name: 'Bóng rổ', icon: '🏀' },
    { id: 'golf' as SportType, name: 'Golf', icon: '⛳' },
    { id: 'all' as SportType, name: 'Đa năng', icon: '🏟️' },
  ];

  return (
    <div id="community-tab-content" className="flex-1 flex flex-col overflow-hidden select-none animate-fadeIn">
      
      {/* View Selector sub-headers */}
      <div className="bg-white border-b border-neutral-100 flex p-2 shadow-2xs gap-2 shrink-0">
        <button
          onClick={() => setSubView('tournaments')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-xl transition cursor-pointer ${
            subView === 'tournaments' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Giải Đấu 🏆
        </button>
        <button
          onClick={() => setSubView('ranking')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-xl transition cursor-pointer ${
            subView === 'ranking' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          Bảng Xếp Hạng 🥇
        </button>
      </div>

      {subView === 'tournaments' ? (
        /* Tournament Lists & Bracket Visualization View */
        <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-neutral-700 uppercase tracking-tight flex items-center gap-1">
              🚀 Giải đấu phong trào SportRes
            </h3>
            <span className="text-[9px] text-neutral-400 font-bold uppercase">Mùa giải 2026</span>
          </div>

          <div className="space-y-3">
            {tournaments.map(tour => {
              const isOpen = selectedTourId === tour.id;
              return (
                <div
                  key={tour.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen ? 'border-emerald-500 shadow-md ring-1 ring-emerald-400/20' : 'border-neutral-200 hover:border-neutral-300 shadow-2xs'
                  }`}
                >
                  {/* Tour Header Summary */}
                  <div
                    onClick={() => setSelectedTourId(isOpen ? null : tour.id)}
                    className="p-3 cursor-pointer flex gap-3"
                  >
                    <SafeImage src={tour.imageUrl} fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800" alt={tour.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase ${
                            tour.status === 'ongoing' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {tour.status === 'ongoing' ? 'Khởi tranh' : 'Mở đăng ký'}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-extrabold font-mono">🏆 {tour.prizePool}</span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-800 leading-tight mt-1">{tour.title}</h4>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] text-neutral-400 mt-1 font-semibold">
                        <span className="flex items-center gap-0.5"><Calendar size={9} /> {tour.date.split(' - ')[0]}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><MapPin size={9} /> {tour.venue.split(' Quận ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible bracket or details info */}
                  {isOpen && (
                    <div className="bg-neutral-50 p-3 border-t border-neutral-100 space-y-3.5 text-left text-xs">
                      {/* Specifications */}
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                          <span className="text-neutral-400 block font-bold text-[8px] uppercase">Địa điểm thi đấu:</span>
                          <span className="font-extrabold text-neutral-700">{tour.venue}</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                          <span className="text-neutral-400 block font-bold text-[8px] uppercase">Số đội tham dự:</span>
                          <span className="font-extrabold text-neutral-700">{tour.registeredCount}/{tour.participantsLimit} đội</span>
                        </div>
                      </div>

                      {/* Bracket Display Tree for ongoing tournament */}
                      {tour.bracket ? (
                        <div className="space-y-2.5">
                          <h5 className="text-[9px] uppercase tracking-wide text-neutral-400 font-extrabold flex items-center gap-1">
                            <span>📊</span> Cây liên kết Sơ đồ vòng loại trực tiếp
                          </h5>

                          <div className="space-y-4 pt-1">
                            {/* Quarter Finals */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[8px] font-black text-neutral-400 uppercase tracking-wide border-b border-neutral-200/60 pb-1">
                                <span>Vòng Tứ Kết</span>
                                <span className="text-emerald-600 font-bold">Đã Kết Thúc</span>
                              </div>
                              <div className="grid grid-cols-1 gap-1.5">
                                {tour.bracket.quarterFinals.map((match, i) => (
                                  <div key={i} className="bg-white rounded-xl border border-neutral-200/60 p-2 flex items-center justify-between text-[10px]">
                                    <div className="flex-1 space-y-1">
                                      <div className={`flex justify-between pr-3 ${match.winner === match.team1 ? 'font-bold text-neutral-800' : 'text-neutral-400'}`}>
                                        <span>{match.team1}</span>
                                        <span>{match.score1}</span>
                                      </div>
                                      <div className={`flex justify-between pr-3 ${match.winner === match.team2 ? 'font-bold text-neutral-800' : 'text-neutral-400'}`}>
                                        <span>{match.team2}</span>
                                        <span>{match.score2}</span>
                                      </div>
                                    </div>
                                    <span className="text-[8px] bg-neutral-100 text-neutral-600 px-1 py-0.5 rounded uppercase font-semibold">Q{i+1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Semifinals */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[8px] font-black text-neutral-400 uppercase tracking-wide border-b border-neutral-200/60 pb-1">
                                <span>Vòng Bán Kết</span>
                                <span className="text-emerald-600 font-bold">Đã Kết Thúc</span>
                              </div>
                              <div className="grid grid-cols-1 gap-1.5">
                                {tour.bracket.semiFinals.map((match, i) => (
                                  <div key={i} className="bg-white rounded-xl border border-neutral-200/60 p-2 flex items-center justify-between text-[10px]">
                                    <div className="flex-1 space-y-1">
                                      <div className={`flex justify-between pr-3 ${match.winner === match.team1 ? 'font-bold text-neutral-800' : 'text-neutral-400'}`}>
                                        <span>{match.team1}</span>
                                        <span>{match.score1}</span>
                                      </div>
                                      <div className={`flex justify-between pr-3 ${match.winner === match.team2 ? 'font-bold text-neutral-800' : 'text-neutral-400'}`}>
                                        <span>{match.team2}</span>
                                        <span>{match.score2}</span>
                                      </div>
                                    </div>
                                    <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded uppercase font-semibold">Semi {i+1}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Grand Finals */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[8px] font-black text-neutral-400 uppercase tracking-wide border-b border-neutral-200/60 pb-1">
                                <span>Trận Chung Kết Quốc Gia</span>
                                <span className="text-amber-600 font-bold animate-pulse">Sắp Diễn Ra</span>
                              </div>
                              <div className="bg-neutral-900 text-white rounded-xl border border-neutral-800 p-3 text-[10px] space-y-2">
                                <div className="flex items-center justify-between text-neutral-400 text-[8px] pb-1 border-b border-neutral-800 font-mono">
                                  <span>CHUNG KẾT SPORTRES COPA</span>
                                  <span>NGÀY 15/06</span>
                                </div>
                                <div className="flex justify-around items-center py-1">
                                  <div className="text-center">
                                    <span className="text-xs font-black block text-emerald-400">{tour.bracket.finals[0].team1}</span>
                                    <span className="text-[8px] text-neutral-500 font-semibold uppercase mt-0.5 block">Vô Địch Bảng A</span>
                                  </div>
                                  <span className="text-xs font-bold text-neutral-500 italic">VS</span>
                                  <div className="text-center">
                                    <span className="text-xs font-black block text-amber-400">{tour.bracket.finals[0].team2}</span>
                                    <span className="text-[8px] text-neutral-500 font-semibold uppercase mt-0.5 block">Vô Địch Bảng B</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Upcoming tournament registration details */
                        <div className="space-y-2 text-center p-2 bg-white rounded-2xl border border-neutral-200/60">
                          <p className="text-[10px] text-neutral-500 leading-relaxed max-w-xs mx-auto">
                            Giải đấu này hiện đang ở trạng thái tiếp nhận đăng ký trực tuyến công khai. Đăng ký sớm để giữ vị thế vòng loại!
                          </p>
                          <button
                            onClick={() => alert('Đăng ký đội của bạn thành công! Chúng tôi đã gửi email thông tin chi tiết điều lệ giải đấu cho bạn.')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-[10px] font-bold shadow-md cursor-pointer mt-1"
                          >
                            Đăng Ký Tham Gia Đội (Miễn phí)
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Leaderboards View Screen */
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Internal sport categories filter tab */}
          <div className="bg-white px-3 py-2 border-b border-neutral-100 flex gap-1 overflow-x-auto scrollbar-none shrink-0">
            {sportsConfig.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSport(s.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-lg transition shrink-0 cursor-pointer ${
                  selectedSport === s.id
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {/* Player list scrolling frame */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-20">
            <div className="flex justify-between items-center text-[9px] text-neutral-400 uppercase tracking-widest font-black mb-1.5 px-1">
              <span>Hạng / Người chơi</span>
              <span>Điểm Rank</span>
            </div>

            {(() => {
              const list = leaderboards[selectedSport] || [];
              return list.map((l, i) => {
                // Check if current user
                const isMe = l.name === 'Trần Minh Quân';
                return (
                  <div
                    key={i}
                    className={`bg-white p-3 rounded-xl border flex justify-between items-center transition shadow-2xs ${
                      isMe ? 'border-emerald-500 ring-1 ring-emerald-400/30 bg-emerald-50/5' : 'border-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank number badge */}
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        l.rank === 1 ? 'bg-amber-100 text-amber-700' : l.rank === 2 ? 'bg-neutral-100 text-neutral-600' : l.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-neutral-50 text-neutral-400'
                      }`}>
                        {l.rank}
                      </span>

                      <SafeImage src={l.avatar} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt={l.name} className="w-8 h-8 rounded-full object-cover border border-neutral-200" />
                      
                      <div className="text-left">
                        <h4 className="text-[11px] font-extrabold text-neutral-800 flex items-center gap-1 leading-tight">
                          <span>{l.name}</span>
                          {isMe && <span className="bg-emerald-600 text-white text-[7px] px-1 rounded-sm uppercase tracking-wider font-extrabold font-mono">Tôi</span>}
                        </h4>
                        <p className="text-[9px] text-neutral-400 font-semibold mt-0.5">Winrate: {l.winRate} • {l.matchesPlayed} Trận</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-neutral-800 block leading-tight">{l.points} pts</span>
                      <span className="text-[8px] text-neutral-400 uppercase tracking-wide font-extrabold">{l.tier}</span>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
