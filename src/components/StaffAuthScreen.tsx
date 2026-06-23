import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, UserCog } from 'lucide-react';
import { useSport } from '../context/SportContext';

interface StaffAuthScreenProps {
  onLogin: (role: 'owner' | 'staff') => void;
  onBack: () => void;
}

export const StaffAuthScreen: React.FC<StaffAuthScreenProps> = ({ onLogin, onBack }) => {
  const { loginUser } = useSport();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showInstructions, setShowInstructions] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      showToast('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.', 'error');
      return;
    }

    const result = await loginUser(phone, password);
    if (!result.success) {
      showToast(result.error || 'Thông tin đăng nhập không hợp lệ.', 'error');
      return;
    }

    const validRoles = ['venue_owner', 'staff', 'admin'];
    if (!result.role || !validRoles.includes(result.role)) {
      showToast('Tài khoản này không có quyền quản lý.', 'error');
      return;
    }

    const roleLabel = result.role === 'venue_owner' ? 'Chủ sân' : result.role === 'admin' ? 'Quản trị viên' : 'Nhân viên';
    showToast(`Đăng nhập thành công với vai trò ${roleLabel}!`);

    const mappedRole = result.role === 'venue_owner' ? 'owner' : (result.role as 'staff' | 'admin');
    setTimeout(() => {
      onLogin(mappedRole as 'owner' | 'staff');
    }, 1000);
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
          <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserCog size={38} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Khu vực quản lý</h1>
          <p className="text-gray-400">Đăng nhập bằng số điện thoại của tài khoản quản lý đã được cấp.</p>
        </div>

        <div className="bg-[#36393f] rounded-2xl p-6 shadow-2xl">
          <div className="space-y-4">
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
              onClick={handleLogin}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
            >
              <ShieldCheck size={20} />
              Xác thực hệ thống
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Chưa có tài khoản quản lý?{' '}
              <button onClick={() => setShowInstructions(true)} className="text-[#22c55e] hover:underline font-semibold">
                Xem hướng dẫn
              </button>
            </p>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Nếu quên số điện thoại đăng nhập, vui lòng liên hệ admin để được hỗ trợ.
          </p>

        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowInstructions(false)}
          />
          <div className="relative bg-[#36393f] rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Hướng dẫn cấp quyền</h3>
              <button onClick={() => setShowInstructions(false)} className="text-gray-400 hover:text-white">
                x
              </button>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <p>Màn hình này dành cho chủ sân và nhân viên đã được đăng ký trên hệ thống.</p>
              <div className="bg-[#202225] rounded-xl p-4">
                <p className="font-semibold text-white mb-2">Cách nhận tài khoản:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Liên hệ admin qua hotline 0987.654.321.</li>
                  <li>Cung cấp thông tin sân và giấy tờ xác thực.</li>
                  <li>Admin sẽ cấp tài khoản qua email hoặc Zalo.</li>
                </ol>
              </div>
              <p className="text-gray-400">Vì lý do bảo mật, tài khoản quản lý không tự đăng ký trực tiếp trên website.</p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-5 w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3 rounded-xl transition"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
