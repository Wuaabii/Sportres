import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { 
  Trophy, Calendar, Users, MapPin,
  ArrowLeft, CalendarCheck, Award
} from 'lucide-react';
import { SafeImage } from './SafeImage';

const sportEmojis: Record<string, string> = {
  soccer: '⚽', badminton: '🏸', tennis: '🎾', basketball: '🏀',
  pickleball: '🏓', volleyball: '🏐', golf: '⛳', all: '🏟️',
};

export const EventsTab: React.FC = () => {
  const { tournaments } = useSport();
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null);

  const activeTournament = tournaments.find(t => t.id === selectedTournament);

  const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
    ongoing: { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'Đang diễn ra' },
    upcoming: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Sắp diễn ra' },
    finished: { bg: 'bg-neutral-100', text: 'text-neutral-500', label: 'Đã kết thúc' },
  };

  if (activeTournament) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 animate-fadeIn">
        {/* Header */}
        <div className="bg-white px-4 pt-6 pb-4 border-b border-neutral-100 shadow-sm shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setSelectedTournament(null)}
              className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-sm font-black text-neutral-800 uppercase tracking-tight flex-1 truncate">
              {activeTournament.title}
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-none">
          {/* Tournament Hero */}
          <div className="relative rounded-2xl overflow-hidden h-40">
            <SafeImage
              src={activeTournament.imageUrl}
              fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800"
              alt={activeTournament.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${statusStyles[activeTournament.status].bg} ${statusStyles[activeTournament.status].text}`}>
                {statusStyles[activeTournament.status].label}
              </span>
              <h2 className="text-white font-black text-sm mt-1.5">{activeTournament.title}</h2>
            </div>
          </div>

          {/* Tournament Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                <Calendar size={11} /> Thời gian
              </div>
              <p className="text-xs font-black text-neutral-800">{activeTournament.date}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                <MapPin size={11} /> Địa điểm
              </div>
              <p className="text-xs font-black text-neutral-800 truncate">{activeTournament.venue}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                <Users size={11} /> Đội tham gia
              </div>
              <p className="text-xs font-black text-neutral-800">
                {activeTournament.registeredCount}/{activeTournament.participantsLimit}
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 font-bold uppercase tracking-widest mb-1">
                <Award size={11} /> Giải thưởng
              </div>
              <p className="text-xs font-black text-emerald-600">{activeTournament.prizePool}</p>
            </div>
          </div>

          {/* Bracket Visualization */}
          {activeTournament.bracket && (
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-tight flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" /> Bảng thi đấu
              </h3>

              {/* Quarter Finals */}
              <div>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2">Tứ kết</p>
                <div className="space-y-2">
                  {activeTournament.bracket.quarterFinals.map((match, i) => (
                    <div key={i} className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[11px]">
                      <div className={`flex-1 font-bold ${match.winner === match.team1 ? 'text-emerald-600' : 'text-neutral-600'}`}>
                        {match.winner === match.team1 && <span className="mr-1">🏆</span>}
                        {match.team1}
                      </div>
                      <div className="bg-neutral-200 text-neutral-700 font-black text-[10px] px-2.5 py-0.5 rounded-lg">
                        {match.score1 ?? '-'} : {match.score2 ?? '-'}
                      </div>
                      <div className={`flex-1 text-right font-bold ${match.winner === match.team2 ? 'text-emerald-600' : 'text-neutral-600'}`}>
                        {match.team2}
                        {match.winner === match.team2 && <span className="ml-1">🏆</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semi Finals */}
              <div>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2">Bán kết</p>
                <div className="space-y-2">
                  {activeTournament.bracket.semiFinals.map((match, i) => (
                    <div key={i} className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-[11px]">
                      <div className={`flex-1 font-bold ${match.winner === match.team1 ? 'text-emerald-600' : 'text-neutral-600'}`}>
                        {match.winner === match.team1 && <span className="mr-1">🏆</span>}
                        {match.team1}
                      </div>
                      <div className="bg-neutral-200 text-neutral-700 font-black text-[10px] px-2.5 py-0.5 rounded-lg">
                        {match.score1 ?? '-'} : {match.score2 ?? '-'}
                      </div>
                      <div className={`flex-1 text-right font-bold ${match.winner === match.team2 ? 'text-emerald-600' : 'text-neutral-600'}`}>
                        {match.team2}
                        {match.winner === match.team2 && <span className="ml-1">🏆</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finals */}
              <div>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2">🏆 Chung kết</p>
                <div className="space-y-2">
                  {activeTournament.bracket.finals.map((match, i) => (
                    <div key={i} className="flex items-center gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px]">
                      <div className={`flex-1 font-black ${match.winner === match.team1 ? 'text-emerald-600' : 'text-neutral-800'}`}>
                        {match.team1}
                      </div>
                      <div className="bg-amber-200 text-amber-800 font-black text-[10px] px-3 py-1 rounded-lg">
                        {match.score1 !== undefined ? `${match.score1} : ${match.score2}` : 'VS'}
                      </div>
                      <div className={`flex-1 text-right font-black ${match.winner === match.team2 ? 'text-emerald-600' : 'text-neutral-800'}`}>
                        {match.team2}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Register Button for upcoming */}
          {activeTournament.status === 'upcoming' && activeTournament.registeredCount < activeTournament.participantsLimit && (
            <button className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition active:scale-[0.98] uppercase tracking-wider">
              Đăng ký tham gia giải đấu
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-neutral-50 animate-fadeIn">
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 border-b border-neutral-100 shadow-sm shrink-0">
        <h1 className="text-lg font-black text-neutral-800 uppercase tracking-tight">
          Sự kiện & Giải đấu
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-none">
        {tournaments.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <CalendarCheck size={48} className="text-neutral-300 mx-auto" />
            <p className="text-sm text-neutral-500 font-bold">Chưa có giải đấu nào.</p>
          </div>
        ) : (
          tournaments.map(tournament => {
            const style = statusStyles[tournament.status];
            return (
                  <div
                    key={tournament.id}
                    onClick={() => setSelectedTournament(tournament.id)}
                    className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition group"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <SafeImage
                        src={tournament.imageUrl}
                        fallbackSrc="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800"
                        alt={tournament.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="text-lg">{sportEmojis[tournament.sport] || '🏟️'}</span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-black text-sm leading-tight">{tournament.title}</h3>
                      </div>
                    </div>
                    <div className="p-3.5 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-1 text-neutral-500 font-semibold">
                          <Calendar size={11} />
                          <span>{tournament.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-500 font-semibold">
                          <MapPin size={11} />
                          <span className="truncate max-w-[120px]">{tournament.venue}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <Users size={11} className="text-neutral-400" />
                          <span className="font-bold text-neutral-600">
                            {tournament.registeredCount}/{tournament.participantsLimit} đội
                          </span>
                          {tournament.registeredCount >= tournament.participantsLimit && (
                            <span className="bg-red-50 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded-full">ĐẦY</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award size={11} className="text-amber-500" />
                          <span className="text-[10px] font-black text-amber-600">{tournament.prizePool}</span>
                        </div>
                      </div>
                    </div>
                  </div>
            );
          })
        )}
      </div>
    </div>
  );
};
