import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSport } from '../context/SportContext';

interface AuthScreenProps {
  onLogin: (role?: string) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack, initialMode = 'login' }) => {
  const { loginUser, registerUser } = useSport();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleFormSubmit = async () => {
    if (!phone) {
      showToast('Vui lòng nhập số điện thoại.', 'error');
      return;
    }
    if (!password) {
      showToast('Vui lòng nhập mật khẩu.', 'error');
      return;
    }
    if (!isLogin) {
      if (!fullname) {
        showToast('Vui lòng nhập họ và tên.', 'error');
        return;
      }
      const result = await registerUser({ fullName: fullname, phone, password });
      if (result.success) {
        showToast('Đăng ký tài khoản thành công!');
        setTimeout(() => onLogin(result.role), 800);
      } else {
        showToast(result.error || 'Đăng ký thất bại.', 'error');
      }
      return;
    }

    const result = await loginUser(phone, password);
    if (result.success) {
      showToast('Đăng nhập thành công!');
      setTimeout(() => onLogin(result.role), 800);
    } else {
      showToast(result.error || 'Đăng nhập thất bại.', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2f3136] text-white p-6 justify-center animate-fadeIn relative">
      {toastMessage && (
        <div
          className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold ${
            toastType === 'error' ? 'bg-red-500 text-white' : 'bg-[#22c55e] text-white'
          }`}
        >
          {toastMessage}
        </div>
      )}

      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white transition">
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản'}
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Đăng nhập bằng số điện thoại để tiếp tục đặt sân và tham gia trận đấu.' : 'Đăng ký tài khoản người chơi SportRes.'}
          </p>
        </div>

        <div className="bg-[#36393f] rounded-2xl p-6 shadow-2xl">
          <div className="flex bg-[#202225] rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-bold transition ${isLogin ? 'bg-[#22c55e] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-bold transition ${!isLogin ? 'bg-[#22c55e] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Đăng ký
            </button>
          </div>

          <div className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  placeholder="Họ và tên của bạn"
                  className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Số điện thoại"
                className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={handleFormSubmit}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-4 rounded-xl transition"
            >
              {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
