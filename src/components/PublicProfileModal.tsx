import React from 'react';
import { User, MapPin, Trophy, Shield, Star, Play, X } from 'lucide-react';
import { SportType } from '../types';
import { useSport } from '../context/SportContext';
import { SafeImage } from './SafeImage';

interface PublicProfileModalProps {
  player: { id: string; name: string; avatar: string; skill?: string };
  onClose: () => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ player, onClose }) => {
  const { user, sendFriendRequest, startPrivateChatWith } = useSport();
  const isCurrentUser = player.id === user.id;

  const handleSendFriendRequest = () => {
    sendFriendRequest({ id: player.id, name: player.name, avatar: player.avatar });
    onClose();
  };

  const handleStartChat = () => {
    startPrivateChatWith({ id: player.id, name: player.name, avatar: player.avatar, favoriteSport: player.skill || 'Chưa cập nhật', status: 'online', statusText: 'Sẵn sàng nhắn tin' });
    onClose();
  };

  // Use current user's profile if it matches, otherwise use simulated data
  const profileData = isCurrentUser ? user : player;
  const area = isCurrentUser ? user.activeArea || 'Hà Nội' : 'Hà Nội';
  const skillLabel = isCurrentUser ? user.skillLevels['soccer'] || player.skill : player.skill;

  // Simulate some full profile data based on basic player info
  const simulatedStats = {
    matchesPlayed: isCurrentUser ? 12 : Math.floor(Math.random() * 50) + 10,
    winRate: isCurrentUser ? 75 : Math.floor(Math.random() * 40) + 40,
    reputation: isCurrentUser ? 100 : Math.floor(Math.random() * 10) + 90,
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn overflow-hidden">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-scaleUp max-h-screen overflow-y-auto">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-br from-emerald-500 to-emerald-700 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Avatar & Basic Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-4">
            <SafeImage 
              src={profileData.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150"} 
              fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
              alt={profileData.name} 
              className="w-24 h-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
            />
            {skillLabel && (
              <span className="bg-emerald-50 text-emerald-600 text-xs font-black uppercase px-3 py-1.5 rounded-xl border border-emerald-200">
                {skillLabel}
              </span>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-neutral-900">{profileData.name}</h2>
            <div className="flex items-center text-neutral-500 text-xs font-semibold mt-1.5 gap-3">
              <span className="flex items-center">
                <MapPin size={13} className="mr-1 text-neutral-400" />
                Hoạt động: {area}
              </span>
              {(isCurrentUser && user.gender) && (
                <span className="flex items-center text-neutral-400">
                  • Giới tính: <span className="text-neutral-500 ml-1">{user.gender}</span>
                </span>
              )}
            </div>
            
            <p className="text-sm text-neutral-600 mt-4 font-medium leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100 italic">
              {isCurrentUser ? '"Cầu thủ tự do đam mê thể thao, tham gia nâng cao sức khỏe và kết bạn tứ phương."' : '"Đam mê thể thao, tìm team giao lưu học hỏi vui vẻ là chính."'}
            </p>

            {/* Favorite Sports & Skills */}
            <div className="mt-5">
              <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> Kỹ năng các môn</h3>
              <div className="flex flex-wrap gap-2">
                {isCurrentUser ? (
                  user.favoriteSports.map(sport => {
                    const mappedSkills: Record<string, string> = { 'soccer': 'Bóng đá', 'badminton': 'Cầu lông', 'tennis': 'Tennis', 'basketball': 'Bóng rổ', 'pickleball': 'Pickleball', 'volleyball': 'Bóng chuyền' };
                    return (
                      <span key={sport} className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-[11px] font-black px-2.5 py-1.5 rounded-xl">
                        {mappedSkills[sport] || sport} - <span className="text-emerald-600 ml-0.5">{user.skillLevels[sport as SportType] || 'Beginner'}</span>
                      </span>
                    )
                  })
                ) : (
                  <span className="bg-neutral-50 border border-neutral-200 text-neutral-700 text-[11px] font-black px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                     Bóng đá - <span className="text-emerald-600 ml-0.5">{player.skill || 'Intermediate'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-emerald-50/50 rounded-2xl p-3 text-center border border-emerald-100/50">
              <div className="text-emerald-500 mb-1 flex justify-center"><Play size={18} /></div>
              <div className="text-xl font-black text-emerald-700">{simulatedStats.matchesPlayed}</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">Tham gia</div>
            </div>
            <div className="bg-amber-50/50 rounded-2xl p-3 text-center border border-amber-100/50">
              <div className="text-amber-500 mb-1 flex justify-center"><Trophy size={18} /></div>
              <div className="text-xl font-black text-amber-700">{simulatedStats.winRate}%</div>
              <div className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">Tỉ lệ thắng</div>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-3 text-center border border-blue-100/50">
              <div className="text-blue-500 mb-1 flex justify-center"><Shield size={18} /></div>
              <div className="text-xl font-black text-blue-700">{simulatedStats.reputation}</div>
              <div className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">Uy tín</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3 mt-8">
            {!isCurrentUser ? (
              <>
                <button onClick={handleSendFriendRequest} className="flex-1 bg-[#3ba55d] hover:bg-[#2e854b] text-white font-bold py-3.5 rounded-xl text-sm transition uppercase tracking-wide">
                  Kết bạn
                </button>
                <button onClick={handleStartChat} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3.5 rounded-xl text-sm transition uppercase tracking-wide">
                  Trò chuyện
                </button>
              </>
            ) : (
              <button 
                onClick={onClose}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3.5 rounded-xl text-sm transition uppercase tracking-wide"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
