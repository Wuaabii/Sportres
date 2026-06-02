import React, { useRef, useState } from 'react';
import {
  ArrowLeftRight,
  ChartLine,
  CreditCard,
  Search,
  ShieldCheck,
  Trophy,
  Zap,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

const sports = [
  {
    title: 'Sân Bóng Đá',
    description: 'Hơn 500 cụm sân cỏ nhân tạo',
    image: '/assets/anh_bong.png',
  },
  {
    title: 'Sân Cầu Lông',
    description: 'Sân thảm chuẩn quốc tế',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?fm=jpg&q=60&w=800',
  },
  {
    title: 'Sân Pickleball',
    description: 'Xu hướng thể thao mới nhất',
    image: '/assets/anh_picball.png',
    imageClassName: 'hue-rotate-90',
  },
  {
    title: 'Sân Tennis',
    description: 'Hỗ trợ đặt theo tháng/năm',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?fm=jpg&q=60&w=800',
  },
  {
    title: 'Sân Bóng Rổ',
    description: 'Sân trong nhà & ngoài trời',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?fm=jpg&q=60&w=800',
  },
  {
    title: 'Sân Bóng Chuyền',
    description: 'Sân tiêu chuẩn thi đấu, độ nảy tốt',
    image: 'https://images.pexels.com/photos/1263426/pexels-photo-1263426.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    title: 'Bóng Bàn',
    description: 'Phòng điều hòa, bàn bạt chống lóa',
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?fm=jpg&q=60&w=800',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [dragState, setDragState] = useState<{ isDown: boolean; startX: number; scrollLeft: number }>({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  const goToAuthSelection = () => onNavigate('/auth');

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider) return;
    setDragState({
      isDown: true,
      startX: event.pageX - slider.offsetLeft,
      scrollLeft: slider.scrollLeft,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;
    if (!slider || !dragState.isDown) return;
    event.preventDefault();
    const x = event.pageX - slider.offsetLeft;
    const walk = (x - dragState.startX) * 2;
    slider.scrollLeft = dragState.scrollLeft - walk;
  };

  return (
    <div className="min-h-screen bg-white text-[#333333]" style={{ fontFamily: 'Mulish, Inter, system-ui, sans-serif' }}>
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/95 px-[8%] py-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2 text-[26px] font-extrabold text-[#2c3e50]"
        >
          <Trophy size={26} className="text-[#2ecc71]" />
          SportRes
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#top" className="text-[15px] font-bold text-[#57606f] transition hover:text-[#2ecc71]">
            Trang chủ
          </a>
          <a href="#tinh-nang" className="text-[15px] font-bold text-[#57606f] transition hover:text-[#2ecc71]">
            Tính năng
          </a>
          <a href="#bo-mon" className="text-[15px] font-bold text-[#57606f] transition hover:text-[#2ecc71]">
            Bộ môn
          </a>
          <button
            type="button"
            onClick={goToAuthSelection}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#2ecc71] to-[#55efc4] px-6 py-2.5 text-[15px] font-bold text-white shadow-[0_5px_15px_rgba(46,204,113,0.3)] transition hover:-translate-y-0.5"
          >
            <ShieldCheck size={17} />
            Tham Gia Ngay
          </button>
        </nav>

        <button
          type="button"
          onClick={goToAuthSelection}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#2ecc71] to-[#55efc4] px-4 py-2 text-sm font-bold text-white shadow-[0_5px_15px_rgba(46,204,113,0.3)] md:hidden"
        >
          <ShieldCheck size={16} />
          Tham gia
        </button>
      </header>

      <main id="top">
        <section className="relative flex min-h-[80vh] items-center justify-between overflow-hidden bg-gradient-to-br from-[#1abc9c] to-[#2ecc71] px-[8%] py-20 text-white max-lg:flex-col max-lg:gap-12 max-lg:text-center">
          <div className="relative z-10 max-w-[550px]">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-[13px] font-bold text-white">
              <Zap size={15} />
              Nền tảng đặt sân thể thao tại Việt Nam
            </span>
            <h1 className="mb-5 text-[46px] font-extrabold leading-tight text-white max-sm:text-4xl">
              Giải pháp đặt sân và quản lý <span className="text-[#f1c40f]">Toàn Diện</span>
            </h1>
            <p className="mb-9 text-base leading-7 text-[#e8f8f5]">
              SportRes giúp kết nối người chơi và chủ sân thể thao chỉ trong vài thao tác chạm. Hỗ trợ người chơi tìm sân,
              đặt sân và kết nối người chơi với nhau. Hỗ trợ quản lý sân cho chủ sân.
            </p>
            <button
              type="button"
              onClick={goToAuthSelection}
              className="rounded-full bg-white px-9 py-4 text-base font-bold text-[#27ae60] shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition hover:-translate-y-1 hover:bg-[#e8f8f5] hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
            >
              Trải Nghiệm Ngay
            </button>
          </div>

          <div className="relative z-10 flex h-[420px] w-[420px] items-center justify-center overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] max-sm:h-[300px] max-sm:w-full">
            <img src="/assets/image_eef743.png" alt="Giao diện SportRes" className="h-[85%] w-[85%] object-contain" />
          </div>
        </section>

        <section id="tinh-nang" className="bg-[#f8f9fa] px-[8%] py-[90px] text-center">
          <span className="mb-2.5 block text-sm font-extrabold uppercase tracking-[2px] text-[#2ecc71]">
            Giá trị mang lại
          </span>
          <h2 className="mb-[50px] text-[34px] font-extrabold text-[#2c3e50]">Tại sao nên chọn SportRes?</h2>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            {[
              {
                icon: Search,
                title: 'Tìm sân siêu tốc',
                body: 'Hệ thống tự động định vị vị trí của bạn để đề xuất các cụm sân thể thao có khung giờ trống gần bạn nhất. Hỗ trợ tìm người chơi cùng.',
              },
              {
                icon: CreditCard,
                title: 'Thanh toán linh hoạt',
                body: 'Tích hợp cổng quét mã QR ngân hàng tự động, ví điện tử. Xác nhận giữ chỗ ngay sau vài giây quét mã thành công.',
              },
              {
                icon: ChartLine,
                title: 'Quản lý doanh thu (Chủ sân)',
                body: 'Biểu đồ báo cáo trực quan giúp chủ sân theo dõi tần suất kín lịch, quản lý nhân sự trực ca, chống trùng lịch tuyệt đối.',
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-3xl border border-black/[0.02] bg-white p-8 text-left shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(46,204,113,0.15)]"
                >
                  <div className="mb-6 flex h-[65px] w-[65px] items-center justify-center rounded-[18px] bg-[#2ecc71]/10 text-[#2ecc71]">
                    <Icon size={28} />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-[#2c3e50]">{item.title}</h3>
                  <p className="text-sm leading-6 text-[#747d8c]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="bo-mon" className="overflow-hidden py-[90px] pl-[8%] pr-0">
          <div className="mb-10 text-left">
            <span className="mb-2.5 block text-sm font-extrabold uppercase tracking-[2px] text-[#2ecc71]">
              Đa dạng bộ môn
            </span>
            <h2 className="mb-2.5 text-[34px] font-extrabold text-[#2c3e50]">Sẵn sàng phục vụ mọi đam mê</h2>
            <p className="flex items-center gap-2 text-sm text-[#747d8c]">
              <ArrowLeftRight size={16} />
              Vuốt hoặc kéo ngang để xem thêm nhiều bộ môn
            </p>
          </div>

          <div
            ref={sliderRef}
            className="w-full cursor-grab overflow-x-auto scroll-smooth pb-6 active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseLeave={() => setDragState(prev => ({ ...prev, isDown: false }))}
            onMouseUp={() => setDragState(prev => ({ ...prev, isDown: false }))}
            onMouseMove={handleMouseMove}
          >
            <div className="flex w-max select-none gap-6 px-1 py-2">
              {sports.map(sport => (
                <article
                  key={sport.title}
                  className="relative h-[380px] w-[280px] flex-none overflow-hidden rounded-3xl shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={sport.image}
                    alt={sport.title}
                    draggable={false}
                    className={`h-full w-full object-cover transition duration-500 hover:scale-110 ${sport.imageClassName ?? ''}`}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 text-left">
                    <h3 className="mb-1 text-[22px] font-bold text-white">{sport.title}</h3>
                    <p className="text-sm font-bold text-[#2ecc71]">{sport.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#0f1418] px-[8%] py-10 text-center text-sm text-[#747d8c]">
        <p>
          © 2026 <b className="text-white">SportRes</b> - Nền tảng số hóa hạ tầng thể thao toàn diện.
        </p>
      </footer>
    </div>
  );
};
