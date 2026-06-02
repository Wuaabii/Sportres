import React from 'react';
import { ArrowLeft, Bell, CheckCircle2, MapPin, MessageSquare, Trash2, Trophy } from 'lucide-react';
import { useSport } from '../context/SportContext';
import { Notification } from '../types';

interface NotificationsOverlayProps {
  onClose: () => void;
}

const getTimeLabel = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

const iconForType = (type: Notification['type']) => {
  if (type === 'booking') return <Bell size={14} />;
  if (type === 'match') return <Trophy size={14} />;
  if (type === 'message') return <MessageSquare size={14} />;
  return <MapPin size={14} />;
};

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({ onClose }) => {
  const { user, notifications, markNotificationRead, deleteNotification } = useSport();
  const visibleNotifications = notifications.filter(n => {
    if (n.type === 'system') return true;
    if (user.role === 'venue_owner') return n.ownerId === user.id || n.recipientUserId === user.id;
    if (user.role === 'staff' || user.role === 'admin') return true;
    return !n.ownerId && (!n.recipientUserId || n.recipientUserId === user.id);
  });

  return (
    <div className="absolute inset-0 bg-neutral-50 z-50 flex flex-col animate-slideIn">
      <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-neutral-100 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg text-neutral-600 transition -ml-1 cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-xs font-black text-neutral-800 uppercase tracking-widest">Thông báo chính thức</h2>
        </div>
        <button
          onClick={() => visibleNotifications.forEach(n => markNotificationRead(n.id))}
          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-500 cursor-pointer flex items-center gap-1 bg-white border border-neutral-100 px-2 py-1 rounded-lg shadow-2xs"
        >
          <CheckCircle2 size={11} />
          Đọc tất cả
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {visibleNotifications.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-neutral-200 mt-8">
            <Bell size={24} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-bold">Bạn đã xem hết các thông báo rồi.</p>
          </div>
        ) : (
          visibleNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`bg-white p-3.5 rounded-2xl border transition relative flex items-start gap-3 cursor-pointer ${
                n.isRead ? 'border-neutral-100 hover:border-neutral-200' : 'border-emerald-500/30 shadow-2xs ring-1 ring-emerald-500/10'
              }`}
            >
              {!n.isRead && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></div>}
              <div className={`p-2 rounded-xl shrink-0 ${
                n.type === 'booking' ? 'bg-emerald-50 text-emerald-600' :
                n.type === 'match' ? 'bg-orange-50 text-orange-600' :
                n.type === 'message' ? 'bg-blue-50 text-blue-600' :
                'bg-neutral-100 text-neutral-600'
              }`}>
                {iconForType(n.type)}
              </div>
              <div className="flex-1 text-left text-xs min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className={`text-[11.5px] tracking-tight leading-tight line-clamp-1 ${n.isRead ? 'font-bold text-neutral-700' : 'font-black text-neutral-900'}`}>{n.title}</h4>
                  <span className="text-[8px] text-neutral-400 font-bold whitespace-nowrap ml-2">{getTimeLabel(n.createdAt)}</span>
                </div>
                <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">{n.body}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="text-neutral-300 hover:text-red-500 p-1 rounded-md transition cursor-pointer self-center"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
