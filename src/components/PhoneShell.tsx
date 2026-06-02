import React, { useState, useEffect } from 'react';
import { RefreshCw, MessageSquare, Home, Calendar, Trophy, User, CalendarCheck, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useSport } from '../context/SportContext';
import { SafeImage } from './SafeImage';

interface PhoneShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAi: () => void;
}

export const PhoneShell: React.FC<PhoneShellProps> = ({
  children,
  activeTab,
  setActiveTab,
  onOpenAi,
}) => {
  const { user } = useSport();
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const strMinutes = minutes < 10 ? '0' + minutes : minutes;
      const strHours = hours < 10 ? '0' + hours : hours;
      setTime(`${strHours}:${strMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, hasBadge: false },
    { id: 'booking', label: 'Đặt sân', icon: Calendar, hasBadge: false },
    { id: 'matchmaking', label: 'Trận đấu', icon: Trophy, hasBadge: false },
    { id: 'messages', label: 'Tin nhắn', icon: MessageSquare, hasBadge: true },
    { id: 'events', label: 'Sự kiện', icon: CalendarCheck, hasBadge: false },
  ];

  // Add management tab for venue owners or staff
  if (user.role === 'venue_owner' || user.role === 'staff') {
    navItems.push({ id: 'management', label: 'Quản lý', icon: LayoutDashboard, hasBadge: false });
  }

  // Add admin tab for admin users
  if (user.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldCheck, hasBadge: false });
  }

  return (
    <div id="app-shell" className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      
      {/* 1. DESKTOP/TABLET SIDE NAVIGATION BAR (Visible on md and up) */}
      <aside className="w-64 bg-white border-r border-neutral-200/60 flex flex-col h-screen sticky top-0 hidden md:flex shrink-0 select-none justify-between py-6 px-4 z-45 shadow-xs">
        <div className="space-y-6">
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Trophy size={18} strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h1 className="text-sm font-black text-neutral-900 tracking-tight leading-none">SportRes</h1>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1 block">Platform v2.5</span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition cursor-pointer select-none group text-left relative ${
                    isSelected 
                      ? 'bg-emerald-50 text-emerald-700 font-extrabold' 
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <item.icon 
                    size={17} 
                    className={`transition-colors ${
                      isSelected ? 'text-emerald-600' : 'text-neutral-450 group-hover:text-neutral-600'
                    }`} 
                  />
                  <span>{item.label}</span>
                  {item.hasBadge && (
                    <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                  {isSelected && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-l-full"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          
          {/* Logged in User Profile Card */}
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-full flex items-center gap-3 p-2 bg-neutral-50/50 rounded-xl border border-neutral-100 hover:bg-neutral-100 transition"
          >
            <SafeImage 
              src={user.avatar} 
              fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
              alt={user.name} 
              className="w-8 h-8 rounded-full border border-neutral-200 object-cover bg-neutral-100" 
            />
            <div className="text-left min-w-0">
              <p className="text-[11.5px] font-black text-neutral-800 truncate">{user.name}</p>
              <span className="text-[8.5px] text-neutral-400 font-bold block truncate uppercase tracking-widest leading-none mt-0.5">
                {user.favoriteSports.map(s => s === 'badminton' ? 'Cầu lông' : 'Bóng đá').join('/')}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER BAR (Visible on mobile only) */}
      <header className="md:hidden flex h-14 items-center justify-between px-4 bg-white border-b border-neutral-150 sticky top-0 z-40 shadow-3xs shrink-0 select-none w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Trophy size={14} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[13px] font-black text-neutral-900 tracking-tight leading-none">SportRes</h1>
            <span className="text-[8px] text-neutral-400 font-extrabold block">v2.5 với AI</span>
          </div>
        </div>
      </header>

      {/* 3. PRIMARY CONTENT VIEWPORT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* App Content Window */}
        <div className="flex-1 bg-neutral-50 overflow-hidden relative flex flex-col" id="app-viewport">
          <div className="flex-1 flex flex-col relative overflow-hidden" id="tab-viewport">
            {children}
          </div>
        </div>

        {/* MOBILE STICKY BOTTOM NAV BAR */}
        <nav className="md:hidden h-16 bg-white border-t border-neutral-150 px-1 py-1.5 flex justify-around items-center sticky bottom-0 z-30 shadow-md">
          {navItems.map(item => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition relative cursor-pointer group"
              >
                <div className="relative mb-0.5">
                  <item.icon
                    size={18}
                    strokeWidth={isSelected ? 2.5 : 2}
                    className={`transition-all group-hover:scale-105 duration-200 ${
                      isSelected ? 'text-[rgb(16,185,129)]' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                  />
                  {item.hasBadge && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  )}
                </div>
                <span className={`text-[9.5px] font-extrabold tracking-tight transition-colors ${isSelected ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                  {item.label}
                </span>
                {isSelected && (
                  <div className="absolute top-0 w-8 h-0.5 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};
