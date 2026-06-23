import React from 'react';
import { ArrowRight, User } from 'lucide-react';

const SPORTRES_LOGO_SRC = '/assets/sportres-logo.png';

export const WelcomeScreen: React.FC<{ 
  onNext: () => void, 
  onLogin: () => void,
  onStaffLogin: () => void 
}> = ({ onNext, onLogin, onStaffLogin }) => {
  return (
    <div className="flex flex-col h-full bg-[#2f3136] text-white p-6 justify-center animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-44 h-28 bg-white rounded-2xl flex items-center justify-center mb-8 p-3 shadow-lg">
            <img src={SPORTRES_LOGO_SRC} alt="SportRes" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-4xl font-black text-white text-center mb-2">SportRes</h1>
        <p className="text-neutral-400 text-center">Đặt sân thể thao dễ dàng</p>
      </div>

      <div className="space-y-4">
        <button onClick={onNext} className="w-full bg-[#22c55e] text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#16a34a] transition">
          Bắt đầu ngay <ArrowRight size={18} />
        </button>
        <button onClick={onLogin} className="w-full bg-transparent border border-[#4f545c] text-neutral-300 font-bold py-4 rounded-lg hover:border-neutral-400">
          Tôi đã có tài khoản
        </button>
        
        <div className="pt-4 border-t border-[#4f545c]/30">
          <button 
            onClick={onStaffLogin} 
            className="w-full bg-[#202225] border border-transparent text-emerald-500 font-extrabold text-xs py-3.5 rounded-lg hover:border-emerald-500/50 transition uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <User size={16} />
            Dành cho Chủ sân / Nhân viên
          </button>
        </div>
      </div>
    </div>
  );
};
