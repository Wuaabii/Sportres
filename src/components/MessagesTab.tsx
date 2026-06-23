import React, { useMemo, useState } from 'react';
import {
  Search,
  MessageSquare,
  Users,
  Send,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  MessageCircle
} from 'lucide-react';
import { useSport } from '../context/SportContext';
import { PublicProfileModal } from './PublicProfileModal';
import { SafeImage } from './SafeImage';
import { FriendItem, PrivateChat } from '../types';

interface GroupChat {
  id: string;
  name: string;
  sportIcon: string;
  lastMessage: string;
  sender: string;
  time: string;
  unreadCount: number;
  members: number;
  history: { sender: string; senderAvatar: string; text: string; time: string }[];
}

export const MessagesTab: React.FC = () => {
  const { user, friends, privateChats, friendRequests, startPrivateChatWith, sendPrivateMessage, acceptFriendRequest, declineFriendRequest } = useSport();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrivateChatId, setActivePrivateChatId] = useState<string | null>(null);
  const [activeGroupChat, setActiveGroupChat] = useState<GroupChat | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [viewingPlayer, setViewingPlayer] = useState<{ id: string; name: string; avatar: string; skill?: string } | null>(null);

  const activePrivateChat = useMemo(
    () => privateChats.find(chat => chat.id === activePrivateChatId) ?? null,
    [privateChats, activePrivateChatId]
  );

  const incomingRequests = useMemo(
    () => friendRequests.filter(req => req.toUser.id === user.id && req.status === 'pending'),
    [friendRequests, user.id]
  );

  const outgoingRequests = useMemo(
    () => friendRequests.filter(req => req.fromUser.id === user.id && req.status === 'pending'),
    [friendRequests, user.id]
  );

  const [groupChats, setGroupChats] = useState<GroupChat[]>([
    {
      id: 'g-chat-1',
      name: 'Hội Đập Cầu Thạch Thất 🏸',
      sportIcon: '⚡',
      lastMessage: 'Minh Quân: Sân tối nay có ai rảnh không ghép cặp ạ?',
      sender: 'Nam Anh',
      time: '5 phút trước',
      unreadCount: 3,
      members: 42,
      history: [
        { sender: 'Nguyễn Văn An', senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', text: 'Hôm nay trời đẹp cực kì, sân tối rậm chưa mọi người?', time: '15:00' },
        { sender: 'Lê Thị Mai', senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', text: 'Chị đặt được một sân lúc 18h rồi nè', time: '15:15' },
        { sender: 'Nam Anh', senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', text: 'Minh Quân: Sân tối nay có ai rảnh không ghép cặp ạ?', time: '15:20' }
      ]
    },
    {
      id: 'g-chat-2',
      name: 'Giải Giao Hữu Pickleball Hà Nội 🏓',
      sportIcon: '✨',
      lastMessage: 'Hoàng Hà: Thời gian thi đấu bắt đầu từ 8h sáng Chủ nhật nhé',
      sender: 'Hoàng Hà',
      time: '4 giờ trước',
      unreadCount: 0,
      members: 18,
      history: [
        { sender: 'Bảo Khánh', senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', text: 'Mọi người chuẩn bị vợt và trang phục thể thao chỉnh tề nhé.', time: 'Hôm qua' },
        { sender: 'Hoàng Hà', senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', text: 'Thời gian thi đấu bắt đầu từ 8h sáng Chủ nhật nhé', time: '10:00' }
      ]
    }
  ]);

  const handleViewProfile = (player: { id: string; name: string; avatar: string; skill?: string }) => {
    setViewingPlayer(player);
  };

  const handleStartPrivateChat = (friend: FriendItem) => {
    const chat = startPrivateChatWith({
      id: friend.id,
      name: friend.name,
      avatar: friend.avatar,
      favoriteSport: friend.favoriteSport,
      status: friend.status,
      statusText: friend.statusText
    });
    setActivePrivateChatId(chat.id);
  };

  const handleSendPrivate = () => {
    if (!typedMessage.trim() || !activePrivateChat) return;
    sendPrivateMessage(activePrivateChat.id, typedMessage.trim());
    setTypedMessage('');
  };

  const handleSendGroup = () => {
    if (!typedMessage.trim() || !activeGroupChat) return;

    const newMessage = {
      sender: user.name,
      senderAvatar: user.avatar,
      text: typedMessage.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setGroupChats(prev => prev.map(group => {
      if (group.id === activeGroupChat.id) {
        const updatedHistory = [...group.history, newMessage];
        const updatedGroup = { ...group, lastMessage: `${user.name}: ${typedMessage.trim()}`, time: 'Vừa xong', history: updatedHistory, unreadCount: 0 };
        setActiveGroupChat(updatedGroup);
        return updatedGroup;
      }
      return group;
    }));

    setTypedMessage('');
  };

  return (
    <div id="messages-tab-content" className="flex-1 flex flex-col overflow-hidden select-none bg-neutral-50 animate-fadeIn h-full">
      
      {/* 1. Header with search */}
      <div className="p-4 bg-white border-b border-neutral-100 shrink-0 space-y-3">
        <div className="flex justify-between items-center">
          <div />
          <h2 className="text-sm font-black text-neutral-800 uppercase">Tin nhắn</h2>
          <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
            <MessageCircle size={16} />
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tin nhắn..."
            className="w-full bg-neutral-55 border border-neutral-200 pl-11 pr-5 py-3 rounded-2xl text-sm font-semibold focus:outline-emerald-500 text-neutral-800 placeholder-neutral-400"
          />
          <Search size={16} className="text-neutral-400 absolute left-4 top-3.5" />
        </div>
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-24">
        <div className="space-y-2 text-left">
          {[
            ...privateChats.map(chat => ({...chat, type: 'individual' as const})),
            ...groupChats.map(group => ({...group, type: 'group' as const}))
          ]
            .filter(c => (c.type === 'individual' ? (c as PrivateChat).participantName : (c as GroupChat).name).toLowerCase().includes(searchQuery.toLowerCase()))
            .map(item => {
              if (item.type === 'individual') {
                const chat = item as PrivateChat;
                return (
                  <div key={chat.id} onClick={() => { setActivePrivateChatId(chat.id); }} className="p-3 hover:bg-neutral-100 transition cursor-pointer flex items-center gap-4 rounded-xl">
                    <div className="relative shrink-0">
                      <button onClick={e => { e.stopPropagation(); handleViewProfile({ id: chat.participantId, name: chat.participantName, avatar: chat.participantAvatar, skill: chat.sport }); }} className="relative w-14 h-14 rounded-full overflow-hidden border-none p-0 bg-transparent cursor-pointer">
                        <SafeImage src={chat.participantAvatar} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt={chat.participantName} className="w-full h-full rounded-full object-cover shadow-xs" />
                        {chat.online && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>}
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5"><h4 className="font-bold text-neutral-900 text-sm truncate">{chat.participantName}</h4><span className="text-xs text-neutral-500">{chat.time}</span></div>
                      <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && <span className="bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm">{chat.unreadCount}</span>}
                  </div>
                );
              } else {
                const group = item as GroupChat;
                return (
                  <div key={group.id} onClick={() => { setGroupChats(prev => prev.map(g => g.id === group.id ? { ...g, unreadCount: 0 } : g)); setActiveGroupChat({ ...group, unreadCount: 0 }); }} className="p-3 hover:bg-neutral-100 transition cursor-pointer flex items-center gap-4 rounded-xl">
                    <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-2xl flex items-center justify-center shrink-0">{group.sportIcon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5"><h4 className="font-bold text-neutral-900 text-sm truncate">{group.name}</h4><span className="text-xs text-neutral-500">{group.time}</span></div>
                      <p className={`text-xs truncate ${group.unreadCount > 0 ? 'font-bold text-neutral-900' : 'text-neutral-500'}`}>{group.lastMessage}</p>
                    </div>
                    {group.unreadCount > 0 && <span className="bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm">{group.unreadCount}</span>}
                  </div>
                );
              }
            })}
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200 p-4 shadow-3xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Bạn bè</p>
              <h3 className="text-sm font-black text-neutral-900">Danh sách bạn bè mới</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between gap-3 p-3 rounded-3xl border border-neutral-100 hover:border-emerald-300 transition cursor-pointer bg-neutral-50" onClick={() => handleStartPrivateChat(friend)}>
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={e => { e.stopPropagation(); handleViewProfile({ id: friend.id, name: friend.name, avatar: friend.avatar, skill: friend.favoriteSport }); }} className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shrink-0 cursor-pointer">
                    <SafeImage src={friend.avatar} fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt={friend.name} className="w-full h-full object-cover" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-neutral-900 truncate">{friend.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{friend.favoriteSport} • {friend.statusText}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${friend.status === 'online' ? 'bg-emerald-50 text-emerald-600' : friend.status === 'busy' ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-600'}`}>
                  {friend.status === 'online' ? 'Online' : friend.status === 'busy' ? 'Bận' : 'Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= CHAT DIALOG OVERLAY (PRIVATE CHAT SCREEN) ================= */}
      {activePrivateChat && (
        <div className="fixed inset-0 bg-neutral-50 z-50 flex flex-col animate-slideIn">
          
          {/* Top navigation header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <div className="flex items-center gap-2 text-left">
              <button 
                onClick={() => setActivePrivateChatId(null)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition -ml-1.5 cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <button onClick={() => handleViewProfile({ id: activePrivateChat.participantId, name: activePrivateChat.participantName, avatar: activePrivateChat.participantAvatar, skill: activePrivateChat.sport })} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-200 shadow-sm cursor-pointer transition hover:scale-[1.02]">
                <SafeImage 
                  src={activePrivateChat.participantAvatar} 
                  fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                  alt={activePrivateChat.participantName} 
                  className="w-full h-full rounded-full object-cover"
                />
                {activePrivateChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </button>
              <div className="min-w-0">
                <h3 className="font-extrabold text-neutral-900 text-xs truncate leading-tight">{activePrivateChat.participantName}</h3>
                <span className="text-[9px] text-[#10B981] font-bold block">{activePrivateChat.sport} • Hoạt động</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-500">
              <button className="p-1.5 hover:bg-neutral-100 rounded-full"><Phone size={14} /></button>
              <button className="p-1.5 hover:bg-neutral-100 rounded-full"><Video size={14} /></button>
              <button className="p-1.5 hover:bg-neutral-100 rounded-full"><MoreVertical size={14} /></button>
            </div>
          </div>

          {/* Interactive message stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-neutral-50/50">
            {activePrivateChat.history.map((msg, i) => {
              const isMe = msg.sender === 'me';
              return (
                <div 
                  key={i} 
                  className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start text-left'}`}
                >
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isMe 
                      ? 'bg-[#10B981] text-white rounded-tr-none shadow-xs' 
                      : 'bg-white text-neutral-800 rounded-tl-none border border-neutral-150 shadow-3xs'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-neutral-400 font-bold mt-1.5 ml-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom message text composer */}
          <div className="p-3.5 bg-white border-t border-neutral-100 shrink-0 pb-6 flex gap-2 items-center">
            <input
              type="text"
              value={typedMessage}
              onChange={e => setTypedMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendPrivate()}
              placeholder="Nhập nội dung nhắn tin..."
              className="flex-1 bg-neutral-55 border border-neutral-200 rounded-xl px-3.5 py-2.2 text-xs font-semibold focus:outline-emerald-500 text-neutral-800"
            />
            <button
              onClick={handleSendPrivate}
              className="w-10 h-10 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/10 cursor-pointer active:scale-95 transition"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}

      {/* ================= CHAT DIALOG OVERLAY (GROUP CHAT SCREEN) ================= */}
      {activeGroupChat && (
        <div className="fixed inset-0 bg-neutral-50 z-50 flex flex-col animate-slideIn">
          
          {/* Top navigation header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 shrink-0 shadow-3xs">
            <div className="flex items-center gap-2 text-left">
              <button 
                onClick={() => setActiveGroupChat(null)}
                className="p-1.5 hover:bg-neutral-100 rounded-lg text-neutral-500 transition -ml-1.5 cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/15 text-[#10B981] flex items-center justify-center border border-emerald-100 text-base font-bold">
                {activeGroupChat.sportIcon}
              </div>
              <div>
                <h3 className="font-extrabold text-neutral-900 text-xs truncate leading-tight">{activeGroupChat.name}</h3>
                <span className="text-[9px] text-neutral-450 font-bold block">Nhóm đấu • {activeGroupChat.members} thành viên</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-neutral-500">
              <button className="p-1.5 hover:bg-neutral-100 rounded-full"><Users size={14} /></button>
              <button className="p-1.5 hover:bg-neutral-100 rounded-full"><MoreVertical size={14} /></button>
            </div>
          </div>

          {/* Message stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-neutral-50/50">
            {activeGroupChat.history.map((msg, i) => {
              const isMe = msg.sender === user.name;
              return (
                <div 
                  key={i} 
                  className={`flex gap-2.5 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start text-left'}`}
                >
                  {!isMe && (
                    <SafeImage 
                      src={msg.senderAvatar} 
                      fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                      alt={msg.sender} 
                      className="w-8 h-8 rounded-full object-cover border border-neutral-100 shrink-0"
                    />
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <span className="text-[9px] text-[#2563EB] font-black mb-1 block">{msg.sender}</span>
                    )}
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-[#10B981] text-white rounded-tr-none shadow-xs' 
                        : 'bg-white text-neutral-800 rounded-tl-none border border-neutral-150 shadow-3xs'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-neutral-400 font-bold mt-1.5">{msg.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom input composer */}
          <div className="p-3.5 bg-white border-t border-neutral-100 shrink-0 pb-6 flex gap-2 items-center">
            <input
              type="text"
              value={typedMessage}
              onChange={e => setTypedMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendGroup()}
              placeholder="Gửi tin nhắn nhóm..."
              className="flex-1 bg-neutral-55 border border-neutral-200 rounded-xl px-3.5 py-2.2 text-xs font-semibold focus:outline-emerald-500 text-neutral-800"
            />
            <button
              onClick={handleSendGroup}
              className="w-10 h-10 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/10 cursor-pointer active:scale-95 transition"
            >
              <Send size={15} />
            </button>
          </div>

        </div>
      )}

      {/* (Removed Friends list overlay) */}

      {viewingPlayer && (
        <PublicProfileModal player={viewingPlayer} onClose={() => setViewingPlayer(null)} />
      )}

    </div>
  );
};
