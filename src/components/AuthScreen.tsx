import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Facebook, MessageSquare, Chrome, Sparkles, MapPin, LocateFixed, Check, ChevronRight, Info } from 'lucide-react';
import { useSport } from '../context/SportContext';

interface AuthScreenProps {
  onLogin: (role?: string) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

const SPORTS_LIST = [
  { id: 'soccer', label: 'Bóng đá' },
  { id: 'badminton', label: 'Cầu lông' },
  { id: 'tennis', label: 'Tennis' },
  { id: 'basketball', label: 'Bóng rổ' },
  { id: 'pickleball', label: 'Pickleball' },
  { id: 'volleyball', label: 'Bóng chuyền' },
];

const SKILL_LEVELS: { id: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro'; label: string }[] = [
  { id: 'Beginner', label: 'Mới tập' },
  { id: 'Intermediate', label: 'Khá' },
  { id: 'Advanced', label: 'Tốt' },
  { id: 'Pro', label: 'Chuyên nghiệp' },
];

const OnboardingWizard: React.FC<{
  initialName: string;
  onComplete: (data: any) => void;
}> = ({ initialName, onComplete }) => {
  const [fullname, setFullname] = useState(initialName);
  const [gender, setGender] = useState('');
  const [area, setArea] = useState('');
  const [sports, setSports] = useState<string[]>([]);
  const [skills, setSkills] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    setArea('Đang lấy vị trí...');
    setTimeout(() => {
      setArea('Quận Cầu Giấy, Hà Nội');
      setIsLocating(false);
    }, 1500);
  };

  const toggleSport = (sportId: string) => {
    setSports(prev => {
      if (prev.includes(sportId)) {
        const next = prev.filter(id => id !== sportId);
        const nextSkills = { ...skills };
        delete nextSkills[sportId];
        setSkills(nextSkills);
        return next;
      }
      return [...prev, sportId];
    });
  };

  const handleFinish = () => {
    if (!fullname || !gender || !area || sports.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    for (const sport of sports) {
      if (!skills[sport]) {
        alert('Vui lòng chọn trình độ cho từng môn thể thao.');
        return;
      }
    }
    onComplete({ fullname, gender, area, sports, skills });
  };

  return (
    <div className="w-full max-w-xl mx-auto text-white animate-fadeIn">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles size={36} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Hoàn thiện hồ sơ</h2>
        <p className="text-gray-400">Giúp SportRes gợi ý sân và đối thủ phù hợp với bạn.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Họ và tên</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              value={fullname}
              onChange={e => setFullname(e.target.value)}
              className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              placeholder="Nhập họ và tên"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Giới tính</label>
          <div className="grid grid-cols-3 gap-3">
            {['Nam', 'Nữ', 'Khác'].map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setGender(item)}
                className={`py-3 rounded-xl font-semibold transition ${
                  gender === item ? 'bg-[#22c55e] text-white' : 'bg-[#202225] text-gray-300 hover:bg-[#36393f]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Khu vực hoạt động</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                placeholder="Nhập quận/huyện, tỉnh/thành"
              />
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-600 transition"
            >
              <LocateFixed size={20} className={isLocating ? 'animate-pulse' : ''} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Môn thể thao hoạt động</label>
          <div className="flex flex-wrap gap-2">
            {SPORTS_LIST.map(sport => (
              <button
                key={sport.id}
                type="button"
                onClick={() => toggleSport(sport.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  sports.includes(sport.id)
                    ? 'bg-[#22c55e] text-white'
                    : 'bg-[#202225] text-gray-300 hover:bg-[#36393f]'
                }`}
              >
                {sports.includes(sport.id) && <Check size={14} />}
                {sport.label}
              </button>
            ))}
          </div>
        </div>

        {sports.length > 0 && (
          <div className="space-y-4 bg-[#202225] rounded-xl p-4">
            <h3 className="font-semibold text-white">Trình độ của bạn</h3>
            {sports.map(sportId => {
              const sport = SPORTS_LIST.find(item => item.id === sportId);
              return (
                <div key={sportId}>
                  <p className="text-sm text-gray-300 mb-2">{sport?.label}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {SKILL_LEVELS.map(level => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setSkills({ ...skills, [sportId]: level.id })}
                        className={`py-2 rounded-lg text-xs font-semibold transition ${
                          skills[sportId] === level.id
                            ? 'bg-[#22c55e] text-white'
                            : 'bg-[#2f3136] text-gray-300 hover:bg-[#36393f]'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleFinish}
          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
        >
          Vào trang chủ <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack, initialMode = 'login' }) => {
  const { updateUserProfile, loginUser, demoUsers } = useSport();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [socialPopup, setSocialPopup] = useState<'google' | 'facebook' | 'zalo' | null>(null);
  const [socialLoading, setSocialLoading] = useState(false);
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setOtpSent(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSendOtp = () => {
    if (!phone) {
      showToast('Vui lòng nhập số điện thoại trước.', 'error');
      return;
    }
    setOtpSent(true);
    setCountdown(60);
    showToast('Mã OTP của bạn là 888999');
  };

  const triggerSocialLogin = (platform: 'google' | 'facebook' | 'zalo') => {
    setSocialPopup(platform);
    setSocialLoading(true);
    setTimeout(() => {
      setSocialLoading(false);
      setTimeout(() => {
        setSocialPopup(null);
        showToast(`Đăng nhập bằng ${platform.toUpperCase()} thành công!`);
        onLogin();
      }, 1200);
    }, 2000);
  };

  const handleFormSubmit = () => {
    if (!phone) {
      showToast('Vui lòng nhập số điện thoại hoặc tên đăng nhập.', 'error');
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
      if (!otp) {
        showToast('Vui lòng nhập mã OTP.', 'error');
        return;
      }
      if (otp !== '888999') {
        showToast('Mã OTP không đúng.', 'error');
        return;
      }
      setShowOnboarding(true);
      return;
    }

    const result = loginUser(phone, password);
    if (result.success) {
      showToast('Đăng nhập thành công!');
      setTimeout(() => onLogin(result.role), 800);
    } else {
      showToast(result.error || 'Đăng nhập thất bại.', 'error');
    }
  };

  if (showOnboarding) {
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
        <OnboardingWizard
          initialName={fullname}
          onComplete={(data) => {
            updateUserProfile({
              name: data.fullname,
              gender: data.gender,
              activeArea: data.area,
              favoriteSports: data.sports,
              skillLevels: data.skills,
            });
            showToast('Tạo hồ sơ thành công! Đang vào trang chủ...');
            setTimeout(() => onLogin(), 1500);
          }}
        />
      </div>
    );
  }

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
            {isLogin ? 'Đăng nhập để tiếp tục đặt sân và tham gia trận đấu.' : 'Đăng ký tài khoản người chơi SportRes.'}
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
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Số điện thoại hoặc tên đăng nhập"
                className="w-full bg-[#202225] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
              />
            </div>

            {!isLogin && (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Nhập mã OTP (888999)"
                  className="flex-1 bg-[#202225] border border-gray-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={countdown > 0}
                  className="px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:bg-gray-600 font-semibold transition"
                >
                  {countdown > 0 ? `${countdown}s` : otpSent ? 'Đã gửi' : 'Gửi OTP'}
                </button>
              </div>
            )}

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
              {isLogin ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
            </button>
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="px-4 text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => triggerSocialLogin('google')}
              className="flex items-center justify-center gap-2 bg-white text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              <Chrome size={18} className="text-red-500" />
              Google
            </button>
            <button
              onClick={() => triggerSocialLogin('facebook')}
              className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-xl font-semibold hover:bg-[#1565C0] transition"
            >
              <Facebook size={18} />
              Facebook
            </button>
            <button
              onClick={() => triggerSocialLogin('zalo')}
              className="flex items-center justify-center gap-2 bg-[#0068FF] text-white py-3 rounded-xl font-semibold hover:bg-[#0052CC] transition"
            >
              <MessageSquare size={18} />
              Zalo
            </button>
          </div>

          {isLogin && (
            <div className="mt-5">
              <button
                onClick={() => setShowDemoPanel(!showDemoPanel)}
                className="w-full flex items-center justify-center gap-2 text-sm text-[#faa61a] hover:text-[#fbbf24] transition"
              >
                <Info size={16} />
                {showDemoPanel ? 'Ẩn tài khoản demo' : 'Xem tài khoản demo'}
              </button>
              {showDemoPanel && (
                <div className="mt-3 bg-[#202225] rounded-xl p-3 space-y-2">
                  {demoUsers
                    .filter(userItem => userItem.role === 'player')
                    .map(userItem => (
                      <button
                        key={userItem.username}
                        onClick={() => {
                          setPhone(userItem.username);
                          setPassword(userItem.password);
                        }}
                        className="w-full text-left p-3 rounded-lg bg-[#2f3136] hover:bg-[#40444b] transition"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">{userItem.profile.name}</p>
                            <p className="text-xs text-gray-400">@{userItem.username}</p>
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{userItem.password}</span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {socialPopup && (
        <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="bg-[#36393f] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            {socialLoading ? (
              <>
                <div className="w-12 h-12 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h4 className="text-lg font-bold mb-2">Đang kết nối...</h4>
                <p className="text-gray-400 text-sm">Vui lòng xác minh thông tin đăng nhập với {socialPopup.toUpperCase()}.</p>
              </>
            ) : (
              <>
                <Sparkles size={48} className="text-[#22c55e] mx-auto mb-4 animate-pulse" />
                <h4 className="text-lg font-bold mb-2">Đã cấp quyền</h4>
                <p className="text-gray-400 text-sm">Chào mừng bạn trở lại với tài khoản {socialPopup.toUpperCase()}.</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
