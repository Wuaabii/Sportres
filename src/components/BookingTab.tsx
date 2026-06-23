import React, { useState } from 'react';
import { useSport } from '../context/SportContext';
import { Court, SubCourt, TimeSlot, Booking, SportType } from '../types';
import { Calendar, Search, MapPin, Clock, Star, Dumbbell, Receipt, HelpCircle, SlidersHorizontal, Map, Compass, Navigation, ShoppingCart, Layers, ChevronLeft } from 'lucide-react';
import { SafeImage, getFallbackImage } from './SafeImage';
import { combineConsecutiveTimeRanges } from '../utils/bookingAggregation';
import { BookingPaymentDetails } from './BookingPaymentDetails';

interface BookingTabProps {
  sportFilter: SportType;
  setSportFilter: (sport: SportType) => void;
}

export const BookingTab: React.FC<BookingTabProps> = ({ sportFilter, setSportFilter }) => {
  const { courts, selectedDate, setSelectedDate, loadTimeSlots, createBookings, confirmBookingTransfer, bookings, cancelBooking, user, selectedCourtId, setSelectedCourtId } = useSport();
  const userBookings = bookings.filter(b => !b.customerId || b.customerId === user.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('All');

  // Custom visual enhancement states
  const [activeLocation, setActiveLocation] = useState('Thạch Thất, Hà Nội');
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showSearchInline, setShowSearchInline] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedSports, setSelectedSports] = useState<SportType[]>([sportFilter]);

  const getBookingStatusMeta = (booking: Booking) => {
    if (booking.paymentStatus === 'pending_transfer') {
      return { label: 'Chờ chuyển khoản', className: 'bg-blue-50 text-blue-700 border border-blue-100', active: false };
    }
    if (booking.paymentStatus === 'waiting_admin_confirmation') {
      return { label: 'Chờ xác nhận thanh toán', className: 'bg-amber-50 text-amber-700 border border-amber-100', active: false };
    }
    switch (booking.status) {
      case 'pending_payment_verification':
        return { label: 'Chờ xác nhận thanh toán', className: 'bg-amber-50 text-amber-700 border border-amber-100', active: false };
      case 'confirmed':
        return { label: 'Đã đặt', className: 'bg-emerald-50 text-emerald-700 border border-emerald-100', active: true };
      case 'completed':
        return { label: 'Hoàn thành', className: 'bg-blue-50 text-blue-700 border border-blue-100', active: true };
      case 'payment_rejected':
        return { label: 'Thanh toán bị từ chối', className: 'bg-red-50 text-red-600 border border-red-100', active: false };
      default:
        return { label: 'Đã hủy hoàn 85%', className: 'bg-red-50 text-red-600 border border-red-100', active: false };
    }
  };

  const getSportFallbackImage = (sport: SportType) => {
    return getFallbackImage(sport);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, sport: SportType) => {
    const target = event.currentTarget;
    target.onerror = null;
    target.src = getSportFallbackImage(sport);
  };

  // Map interactive states
  const [selectedMapCourtId, setSelectedMapCourtId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'classic' | 'satellite'>('classic');
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const mapInstanceRef = React.useRef<any>(null);
  const tileLayerRef = React.useRef<any>(null);
  const markersGroupRef = React.useRef<any>(null);

  const getSportMarkerMeta = (sport: SportType) => {
    switch (sport) {
      case 'soccer':
        return { color: '#10b981', icon: '⚽' };
      case 'badminton':
        return { color: '#f97316', icon: '🏸' };
      case 'tennis':
        return { color: '#2563eb', icon: '🎾' };
      case 'basketball':
        return { color: '#8b5cf6', icon: '🏀' };
      case 'pickleball':
        return { color: '#0ea5e9', icon: '🏓' };
      case 'volleyball':
        return { color: '#f43f5e', icon: '🏐' };
      case 'golf':
        return { color: '#15803d', icon: '⛳' };
      default:
        return { color: '#64748b', icon: '🏟️' };
    }
  };

  const getCourtMapCoordinates = (court: Court) => {
    if (typeof court.latitude === 'number' && typeof court.longitude === 'number') {
      return { lat: court.latitude, lng: court.longitude };
    }

    // Fallback theo khu vực để app không crash khi dữ liệu cũ/database thiếu lat/lng.
    const area = `${court.district} ${court.address}`.toLowerCase();
    if (area.includes('quốc oai')) return { lat: 20.9918, lng: 105.6402 };
    if (area.includes('đại học quốc gia')) return { lat: 21.0033, lng: 105.5424 };
    if (area.includes('fpt')) return { lat: 21.0138, lng: 105.5250 };
    if (area.includes('hòa lạc') || area.includes('hoà lạc')) return { lat: 21.0120, lng: 105.5235 };
    if (area.includes('phùng xá')) return { lat: 21.0260, lng: 105.5290 };
    if (area.includes('liên quan')) return { lat: 20.9990, lng: 105.5390 };
    if (area.includes('bình yên')) return { lat: 21.0095, lng: 105.5285 };
    if (area.includes('thạch thất')) return { lat: 21.0115, lng: 105.5260 };
    return null;
  };

  const matchesCourtFilters = (court: Court) => {
    const activeSports = selectedSports.length > 0 ? selectedSports : [sportFilter];
    const matchesSport = activeSports.includes('all') || activeSports.includes(court.sport);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      court.name.toLowerCase().includes(query) ||
      court.address.toLowerCase().includes(query) ||
      court.district.toLowerCase().includes(query);
    const district = districtQuery.toLowerCase();
    const matchesDistrict = districtQuery === 'All' ||
      court.district.toLowerCase().includes(district) ||
      court.address.toLowerCase().includes(district);
    return matchesSport && matchesSearch && matchesDistrict;
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([21.0115, 105.5260], 15, { animate: true });
    }
  };

  React.useEffect(() => {
    if (!showMapView) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS dynamically from standard CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Load Leaflet JS dynamically from standard CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Keep cleanup lightweight
    };
  }, [showMapView]);

  React.useEffect(() => {
    if (!showMapView || !leafletLoaded) return;

    const L = (window as any).L;
    if (!L) return;

    // 1. Initialize Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map('leaflet-map-element', {
        center: [21.0115, 105.5260], // Centered beautifully at Thạch Thất FPT area
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);

      // Add user location avatar pulsing marker
      const userIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-emerald-500 rounded-full opacity-15 animate-ping"></div>
            <div class="absolute w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center animate-pulse">
              <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        `,
        className: '',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      L.marker([21.0115, 105.5260], { icon: userIcon }).addTo(map);
    }

    const map = mapInstanceRef.current;

    // 2. Clear previous active Tile Layers
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Esri World Imagery Satellite tiles vs Light theme high-fidelity mapnik tiles from CartoDB (gorgeous & speed optimized)
    const tileUrl = mapStyle === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
    }).addTo(map);

    // 3. Clear and Update Markers on map
    const markersGroup = markersGroupRef.current;
    markersGroup.clearLayers();

    const validMapCourts = courts
      .filter(matchesCourtFilters)
      .map(court => ({ court, coord: getCourtMapCoordinates(court) }))
      .filter((item): item is { court: Court; coord: { lat: number; lng: number } } => Boolean(item.coord));

    validMapCourts.forEach(({ court, coord }) => {
      const isSelected = selectedMapCourtId === court.id;
      const markerMeta = getSportMarkerMeta(court.sport);
      const iconHtml = `
        <div class="flex flex-col items-center select-none active:scale-95 transition-transform duration-150 transform -translate-x-1/2 -translate-y-[calc(100%-4px)]">
          <button
            style="background-color: ${markerMeta.color}"
            class="w-10 h-10 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-base font-bold transition-all duration-200 cursor-pointer ${
              isSelected ? 'ring-[5px] ring-emerald-500/40 scale-115' : 'hover:scale-105'
            }"
          >
            ${markerMeta.icon}
          </button>
          <div class="mt-1 bg-white border border-neutral-200/50 shadow-md py-1 px-2.5 rounded-lg whitespace-nowrap">
            <span class="text-[10px] font-black text-neutral-800 tracking-tight">
              ${court.name}
            </span>
          </div>
          <div class="w-2.5 h-2.5 rotate-45 bg-white border-r border-b border-neutral-200/50 -mt-1.5 shadow-3xs"></div>
        </div>
      `;

      const customMarkerIcon = L.divIcon({
        html: iconHtml,
        className: '',
        iconSize: [120, 80],
        iconAnchor: [60, 60],
      });

      const marker = L.marker([coord.lat, coord.lng], { icon: customMarkerIcon });

      marker.on('click', () => {
        setSelectedMapCourtId(court.id);
        map.panTo([coord.lat - 0.0015, coord.lng], { animate: true, duration: 0.5 });
      });

      marker.addTo(markersGroup);
    });

  }, [showMapView, leafletLoaded, sportFilter, selectedSports, districtQuery, searchQuery, selectedMapCourtId, mapStyle, courts]);

  // Expanded court section states (collapsible)
  const [expandedCourtId, setExpandedCourtId] = useState<string | null>(null);
  const [selectedSubCourtId, setSelectedSubCourtId] = useState<string | null>(null);
  const [activeSchedulingCourtId, setActiveSchedulingCourtId] = useState<string | null>(null);

  // Handle cross-tab selection from Home
  React.useEffect(() => {
    if (selectedCourtId) {
      setActiveSchedulingCourtId(selectedCourtId);
      setExpandedCourtId(selectedCourtId);
      setSelectedCourtId(null); // Reset after consumption
    }
  }, [selectedCourtId, setSelectedCourtId]);

  // Cart selections
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const getSlotPrice = (slot: TimeSlot) => {
    if (Number(slot.price) > 0) return Number(slot.price);
    for (const venue of courts) {
      const court = venue.subCourts.find(item => item.id === slot.court_id);
      if (court) return Number(court.pricePerHour || venue.priceMin || 0);
    }
    return 0;
  };
  const summarizeSelectedSlotTimes = (items: TimeSlot[]) =>
    combineConsecutiveTimeRanges(items.map(slot => slot.time));

  // Extras options
  const [numRackets, setNumRackets] = useState(0);
  const [numWater, setNumWater] = useState(0);

  // Checkout flows
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeCreatedTicket, setActiveCreatedTicket] = useState<Booking | null>(null);
  const [createdPaymentTickets, setCreatedPaymentTickets] = useState<Booking[]>([]);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [slotLoadError, setSlotLoadError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!activeSchedulingCourtId) return;
    let active = true;
    setSlotLoadError(null);
    loadTimeSlots(activeSchedulingCourtId, selectedDate).catch(error => {
      if (active) setSlotLoadError(error instanceof Error ? error.message : 'Không thể tải khung giờ.');
    });
    return () => {
      active = false;
    };
  }, [activeSchedulingCourtId, selectedDate]);

  // My Ticket view toggling
  const [showMyTickets, setShowMyTickets] = useState(false);

  // Localized information map for Thạch Thất elements
  const getMarketingCourtInfo = (courtId: string) => {
    switch (courtId) {
      case 'court-1':
        return {
          name: 'Sân Bóng Đá Thành Phát',
          address: '📍 Xã Bình Yên, Thạch Thất, Hà Nội',
          distance: '0.8 km • Xã Bình Yên',
          priceLabel: '300.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
          tags: ['Cỏ nhân tạo', 'Mở cửa: 06:00 - 23:00'],
        };
      case 'court-2':
        return {
          name: 'CLB Cầu Lông Đa Năng',
          address: '📍 Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
          distance: '1.2 km • Hòa Lạc',
          priceLabel: '80k - 120k/h',
          imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
          tags: ['Trong nhà', 'Wifi miễn phí'],
        };
      case 'court-3':
        return {
          name: 'Sân Tennis Thạch Thất',
          address: '📍 Thị trấn Liên Quan, Thạch Thất, Hà Nội',
          distance: '2.5 km • TT. Liên Quan',
          priceLabel: '150k - 200k/h',
          imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
          tags: ['Sân ngoài trời', 'Đèn chiếu đêm'],
        };
      case 'court-4':
        return {
          name: 'Sân Bóng Rổ Thạch Thất Club',
          address: '📍 Phùng Xá, Thạch Thất, Hà Nội',
          distance: '3.1 km • Xã Phùng Xá',
          priceLabel: '120k - 180k/h',
          imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=600&q=80',
          tags: ['Sàn gỗ cao cấp', 'Có trọng tài'],
        };
      case 'court-5':
        return {
          name: 'Sân Bóng Đá Grasslands Bình Yên',
          address: '📍 Đường tỉnh 420, Xã Bình Yên, Thạch Thất, Hà Nội',
          distance: '0.9 km • Xã Bình Yên',
          priceLabel: '280.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=600',
          tags: ['Mặt cỏ chuẩn FIFA', 'Mở cửa: 05:00 - 23:00'],
        };
      case 'court-6':
        return {
          name: 'Nhà Thi Đấu Thể Thao Hòa Lạc',
          address: '📍 Khu công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
          distance: '1.4 km • Hòa Lạc',
          priceLabel: '95k - 150k/h',
          imageUrl: 'https://images.pexels.com/photos/8007171/pexels-photo-8007171.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['Thảm thi đấu', 'Phòng tắm vòi sen'],
        };
      case 'court-7':
        return {
          name: 'Sân Quần Vợt Liên Quan',
          address: '📍 Thị trấn Liên Quan, Thạch Thất, Hà Nội',
          distance: '2.4 km • TT. Liên Quan',
          priceLabel: '140k - 190k/h',
          imageUrl: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['Chuẩn kích thước', 'Lưới chắn gió'],
        };
      case 'court-8':
        return {
          name: 'Sân bóng SunSport Bình Yên',
          address: '📍 Xã Bình Yên, Thạch Thất, Hà Nội',
          distance: '1.0 km • Xã Bình Yên',
          priceLabel: '220.000đ/giờ',
          imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['Dịch vụ quay phim', 'Cho mượn bib free'],
        };
      case 'court-9':
        return {
          name: 'CLB Cầu Lông Sun-Light Phùng Xá',
          address: '📍 Xã Phùng Xá, Thạch Thất, Hà Nội',
          distance: '3.3 km • Xã Phùng Xá',
          priceLabel: '85k - 130k/h',
          imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
          tags: ['Hỗ trợ ghép cặp', 'Chỗ để xe an toàn'],
        };
      case 'court-10':
        return {
          name: 'Sân Pickleball Tech-Hub Hòa Lạc',
          address: '📍 Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',
          distance: '1.4 km • Hòa Lạc',
          priceLabel: '120.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
          tags: ['Vợt Selkirk Mỹ', 'Trào lưu hot'],
        };
      case 'court-11':
        return {
          name: 'Sân Bóng Chuyền Hữu Nghị Liên Quan',
          address: '📍 Thị trấn Liên Quan, Thạch Thất, Hà Nội',
          distance: '2.5 km • TT. Liên Quan',
          priceLabel: '100.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600',
          tags: ['Trần cao thoáng', 'Mặt sơn chống lóa'],
        };
      case 'court-12':
        return {
          name: 'Tổ hợp Golf 3D & Mini Green Bình Yên',
          address: '📍 Xã Bình Yên, Thạch Thất, Hà Nội',
          distance: '0.9 km • Xã Bình Yên',
          priceLabel: '350.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=600&q=80',
          tags: ['Phân tích Swing', 'Gậy Callaway xịn'],
        };
      case 'court-13':
        return {
          name: 'Sân Thể Thao Đa Năng Bình Yên',
          address: '📍 Sân văn hóa thể thao Xã Bình Yên, Thạch Thất, Hà Nội',
          distance: '0.9 km • Xã Bình Yên',
          priceLabel: '90.000đ/giờ',
          imageUrl: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',
          tags: ['Đa năng tổng hợp', 'Mở cửa tự do'],
        };
      default:
        return {
          name: 'Cơ sở TDTT Thạch Thất',
          address: '📍 Thạch Thất, Hà Nội',
          distance: '1.5 km • Thạch Thất',
          priceLabel: '100.000đ/giờ',
          imageUrl: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800',
          tags: ['Tiện nghi tốt', 'Đạt chuẩn'],
        };
    }
  };

  const getLocalizedCourtInfo = (courtId: string) => {
    const marketing = getMarketingCourtInfo(courtId);
    const court = courts.find(c => c.id === courtId);

    if (!court) return marketing;

    return {
      ...marketing,
      name: court.name,
      address: `📍 ${court.address}`,
      priceLabel: `từ ${court.priceMin.toLocaleString('vi-VN')}đ/giờ`,
      imageUrl: court.imageUrl || marketing.imageUrl,
    };
  };

  // Helper date text
  const getOffsetDateLabel = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    if (offset === 0) return 'Hôm nay';
    if (offset === 1) return 'Mai';
    const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${weekdays[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
  };

  const getOffsetDateString = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const canReopenPayment = (booking: Booking) =>
    booking.status === 'pending_payment_verification'
    && ['pending_transfer', 'waiting_admin_confirmation'].includes(booking.paymentStatus);

  const datesPool = [0, 1, 2, 3, 4, 5, 6, 7].map(idx => ({
    label: getOffsetDateLabel(idx),
    value: getOffsetDateString(idx),
  }));

  const subdivisionsPool = [
    { label: 'Tất cả khu vực', value: 'All' },
    { label: 'Xã Bình Yên', value: 'Bình Yên' },
    { label: 'Khu công nghệ cao Hòa Lạc', value: 'Hòa Lạc' },
    { label: 'Thị trấn Liên Quan', value: 'Liên Quan' },
    { label: 'Xã Phùng Xá', value: 'Phùng Xá' }
  ];

  // Geolocation trigger using GPS
  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setActiveLocation('Phùng Xá, Thạch Thất 🛰️');
            setIsLocating(false);
            setShowLocationSelect(false);
          }, 850);
        },
        (error) => {
          setTimeout(() => {
            setActiveLocation('Xã Bình Yên, Thạch Thất 📍');
            setIsLocating(false);
            setShowLocationSelect(false);
          }, 850);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setActiveLocation('Hòa Lạc, Thạch Thất');
        setIsLocating(false);
        setShowLocationSelect(false);
      }, 500);
    }
  };

  // Sync selectedSports with horizontal sportFilter when it changes in parent
  React.useEffect(() => {
    setSelectedSports([sportFilter]);
  }, [sportFilter]);

  const toggleSportInFilter = (id: SportType) => {
    setSelectedSports(prev => {
      if (id === 'all') {
        return ['all'];
      }
      const withoutAll = prev.filter(s => s !== 'all');
      if (prev.includes(id)) {
        const updated = withoutAll.filter(s => s !== id);
        return updated.length === 0 ? ['all'] : updated;
      } else {
        return [...withoutAll, id];
      }
    });
  };

  // Filter facilities
  const filteredCourts = courts.filter(c => {
    return matchesCourtFilters(c);
  });

  const sportsConfig = [
    { id: 'badminton' as SportType, name: 'Cầu lông' },
    { id: 'soccer' as SportType, name: 'Bóng đá' },
    { id: 'pickleball' as SportType, name: 'Pickleball' },
    { id: 'tennis' as SportType, name: 'Quần vợt' },
    { id: 'volleyball' as SportType, name: 'Bóng chuyền' },
    { id: 'basketball' as SportType, name: 'Bóng rổ' },
    { id: 'golf' as SportType, name: 'Golf' },
    { id: 'all' as SportType, name: 'Đa năng' },
  ];

  const handleSelectSlot = (slot?: TimeSlot | null) => {
    try {
      console.log('Clicked slot:', slot);
      if (!slot) return;
      if (!slot.id) {
        console.error('[booking:invalid-slot] Missing database ID:', slot);
        setBookingError('Khung giờ này chưa được tạo trong hệ thống. Vui lòng thử lại hoặc chọn ngày khác.');
        return;
      }
      if (slot.status !== 'available') return;

      setBookingError(null);
      setSelectedSlots(previous => {
        const alreadySelected = previous.some(selected => selected.id === slot.id);
        const next = alreadySelected
          ? previous.filter(selected => selected.id !== slot.id)
          : [...previous, slot];
        console.log('Selected slots:', next);
        return next;
      });
      setSelectedSlot(null);
      setSelectedSubCourtId(slot.court_id);
      setNumRackets(0);
      setNumWater(0);
    } catch (error) {
      console.error('[booking:slot-click-error]', { error, slot });
      setBookingError('Không thể chọn khung giờ này. Vui lòng thử lại.');
    }
  };

  // Live price calculations
  const extrasPrice = (numRackets * 25000) + (numWater * 10000);
  const finalPrice = selectedSlot ? (getSlotPrice(selectedSlot) + extrasPrice) : 0;

  const handleCheckoutSubmit = async () => {
    const rawSelections: TimeSlot[] = selectedSlots.length > 0
      ? selectedSlots
      : selectedSlot && selectedSubCourtId
        ? [selectedSlot]
        : [];
    const timeSlotIds = rawSelections.map(slot => slot.id);
    console.log('Submitting timeSlotIds:', timeSlotIds);
    const result = await createBookings(rawSelections, selectedDate, { rackets: numRackets, water: numWater });
    if (!result.success || !result.bookings?.length) {
      setBookingError(result.error || 'Đã xảy ra lỗi.');
      return;
    }

    setCreatedPaymentTickets(result.bookings);
    setActiveCreatedTicket(result.bookings[0]);
    setBookingError(null);
  };

  const renderScheduler = () => {
    const activeCourt = courts.find(c => c.id === activeSchedulingCourtId);
    const subCourtsList = activeCourt?.subCourts || [];
    const localized = getLocalizedCourtInfo(activeSchedulingCourtId || '');
    const standardSlots = subCourtsList[0]?.slots[selectedDate] || [];
    const selectedSubCourt = subCourtsList.find(s => s.id === selectedSubCourtId);

    // Derived multi selection names
    const selectedSubCourtsNames = selectedSlots.map(slot => {
      const match = subCourtsList.find(sub => sub.id === slot.court_id);
      return match ? match.name : '';
    }).filter(Boolean).filter((v, idx, arr) => arr.indexOf(v) === idx).join(', ');

    const getDetailedVietnameseDate = (dateStr: string) => {
      if (!dateStr) return '';
      try {
        const d = new Date(dateStr);
        const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const currentDayOfWeek = weekdays[d.getDay()];
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${currentDayOfWeek}, ${day}/${month}/${year}`;
      } catch (e) {
        return dateStr;
      }
    };

    const getDayAndDateLocal = (dateStr: string) => {
      const d = new Date(dateStr);
      const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const weekday = weekdays[d.getDay()];
      const dateNum = d.getDate().toString().padStart(2, '0');
      return { weekday, dateNum };
    };

    return (
      <div id="visual-scheduler-screen" className="flex-1 flex flex-col overflow-hidden bg-[#f4f7f6] animate-fadeIn">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200/50 px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
          <button
            onClick={() => {
              setActiveSchedulingCourtId(null);
              setSelectedSlot(null);
              setSelectedSlots([]);
              setSelectedSubCourtId(null);
            }}
            className="w-9 h-9 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-xl flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm font-black text-neutral-800 tracking-tight text-center flex-1">
            Chọn lịch đặt sân
          </h2>
          <div className="w-9" />
        </div>

        {/* Scrollable contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Facility Header Summary */}
          {activeCourt && (
            <div className="bg-white rounded-2xl p-3 border border-neutral-200/50 shadow-3xs flex gap-3 items-center text-left">
              <SafeImage
                src={localized.imageUrl || getSportFallbackImage(activeCourt.sport)}
                fallbackSrc={getSportFallbackImage(activeCourt.sport)}
                sportType={activeCourt.sport}
                alt={localized.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="text-left min-w-0 flex-1">
                <h4 className="text-[12px] font-black text-neutral-800 leading-tight">
                  {localized.name}
                </h4>
                <p className="text-[9.5px] text-neutral-400 font-bold flex items-center gap-1 mt-1 font-semibold leading-none">
                  <MapPin size={9} className="text-neutral-400 shrink-0" />
                  <span className="truncate">{localized.address.replace('📍 ', '')}</span>
                </p>
              </div>
            </div>
          )}

          {/* Sticky notice reminder similar to Screen 2 */}
          <div className="bg-amber-50/80 border border-amber-250/50 rounded-xl p-3 text-left">
            <p className="text-[9.5px] text-amber-805 font-semibold leading-relaxed">
              <span className="text-amber-900 font-black">Lưu ý:</span> Nếu bạn cần đặt lịch cố định, vui lòng liên hệ hotline: <span className="underline font-black text-amber-950">0353.587.171</span> để được tư vấn và hỗ trợ tốt nhất.
            </p>
          </div>

          {/* 1. Date Selector Carousel from Screen 1 */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider pl-1 font-extrabold pb-1 block">
              Chọn ngày thi đấu
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {datesPool.map((dateObj) => {
                const isSelected = selectedDate === dateObj.value;
                const { weekday, dateNum } = getDayAndDateLocal(dateObj.value);
                return (
                  <button
                    key={dateObj.value}
                    onClick={() => {
                      setSelectedDate(dateObj.value);
                      setSelectedSlot(null);
                      setSelectedSlots([]);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl w-14 h-16 shrink-0 transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-[rgb(16,185,129)] border-emerald-400 text-white shadow-md shadow-emerald-500/20 font-black'
                        : 'bg-white border-neutral-200/60 text-neutral-600 hover:bg-neutral-50/90 font-semibold'
                    }`}
                  >
                    <span className={`text-[9.5px] uppercase ${isSelected ? 'text-white font-extrabold' : 'text-neutral-400 font-bold'}`}>
                      {weekday}
                    </span>
                    <span className="text-base font-black leading-none mt-1">
                      {dateNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Visual Scheduler Hour Grid Matrix from Screen 2 */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-4 space-y-3 shadow-3xs text-left font-sans">
            <div className="flex justify-between items-center pb-1">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider pl-1 font-extrabold pb-0.5">
                Khung giờ
              </span>
              {/* Color status indicators */}
              <div className="flex gap-1.5 items-center text-[8px] text-neutral-500 font-bold">
                <div className="flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-2xs bg-white border border-emerald-300 block"></span>
                  <span>Trống</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-2xs bg-[#f06a6a] block"></span>
                  <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="w-2 h-2 rounded-2xs bg-neutral-200 block" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ccc, #ccc 2px, #f5f5f5 2px, #f5f5f5 4px)' }}></span>
                  <span>Khóa</span>
                </div>
              </div>
            </div>

            <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-neutral-50/50">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-max border-collapse">
                  <thead>
                    <tr className="bg-neutral-100/80">
                      <th className="sticky left-0 bg-neutral-100 z-20 border-b border-r border-neutral-200 p-2 text-[8px] font-black text-neutral-500 text-left min-w-[70px] shadow-[2px_0_4px_rgba(0,0,0,0.02)] uppercase">
                        PHÂN SÂN
                      </th>
                      {standardSlots.map((slot, index) => {
                        const startTime = slot.time.split(' - ')[0];
                        return (
                          <th key={slot.id || `${slot.start_time}-${index}`} className="border-b border-neutral-150 p-2 text-[8px] font-black text-neutral-500 text-center min-w-[68px] tracking-tight">
                            {startTime}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {subCourtsList.map((subCourt) => {
                      const slotsForSub = subCourt.slots[selectedDate] || [];
                      return (
                        <tr key={subCourt.id}>
                          <td className="sticky left-0 bg-white z-10 border-r border-b border-neutral-200 p-2 text-[9.5px] font-black text-neutral-800 text-left shadow-[2px_0_4px_rgba(0,0,0,0.03)] min-w-[76px] h-14 flex items-center leading-tight">
                            {subCourt.name.replace(' (Premium)', '').replace(' (Khán đài)', '').replace(' (Sân 5 người)', '').replace(' (Sân 7 người)', '').replace('Sân bóng đá sô ', 'Sân ').replace('Sân Bóng số ', 'Sân ')}
                          </td>
                          {slotsForSub.map((slot, index) => {
                            const isSelected = selectedSlots.some(selected => selected.id === slot.id);
                            const isBooked = slot.status === 'booked';
                            const isLocked = slot.status !== 'available' && slot.status !== 'booked';

                            let cellBg = "";
                            let cellText = "";
                            
                            if (isSelected) {
                              cellBg = "bg-emerald-500 border-1.5 border-emerald-400 text-white font-black shadow-md shadow-emerald-500/15";
                              cellText = "Chọn";
                            } else if (isBooked) {
                              cellBg = "bg-[#f06a6a] text-white font-black cursor-not-allowed border border-white/10";
                              cellText = "Đã đặt";
                            } else if (isLocked) {
                              cellBg = "text-neutral-400 font-bold cursor-not-allowed border border-neutral-100";
                              cellText = "Khóa";
                            } else {
                              cellBg = "bg-white hover:bg-emerald-50 border border-emerald-250 text-emerald-600 font-extrabold";
                              cellText = "Trống";
                            }

                            return (
                              <td key={slot.id || `${subCourt.id}-${slot.start_time}-${index}`} className="p-0.5 border-b border-r border-neutral-150/40">
                                <button
                                  disabled={false}
                                  onClick={() => {
                                    handleSelectSlot(slot);
                                    setExpandedCourtId(activeSchedulingCourtId);
                                  }}
                                  style={{
                                    backgroundImage: isLocked 
                                      ? 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2.5px, #f5f5f5 2.5px, #f5f5f5 5px)' 
                                      : undefined
                                  }}
                                  className={`w-[62px] h-[35px] rounded-lg flex items-center justify-center p-0.5 text-[8px] transition duration-100 cursor-pointer ${cellBg}`}
                                >
                                  <span className="uppercase font-black tracking-wider text-center leading-none text-[8px]">{cellText}</span>
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {(slotLoadError || standardSlots.length === 0) && (
              <p className="text-[9px] font-bold text-red-500 px-1">
                {slotLoadError || 'Không có dữ liệu khung giờ cho ngày đã chọn.'}
              </p>
            )}
            {bookingError && !showCheckoutModal && (
              <p className="text-[9px] font-bold text-red-500 px-1">{bookingError}</p>
            )}
          </div>

          {/* 3. Booking Summary from Screen 1 */}
          <div className="bg-white rounded-3xl border border-neutral-200/50 p-4 space-y-3 shadow-3xs text-left font-sans">
            <h3 className="text-xs font-black text-neutral-800 tracking-tight">
              Tóm tắt đặt sân
            </h3>

            <div className="space-y-2.5 text-[11px] pt-1 font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">Ngày đặt:</span>
                <span className="font-extrabold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-lg border border-neutral-200/40 text-[10px]">
                  {getDetailedVietnameseDate(selectedDate)}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-neutral-100 pt-2">
                <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">Phân sân:</span>
                <span className="font-extrabold text-neutral-800 text-[10.5px] text-right max-w-[200px] truncate">
                  {selectedSlots.length > 0 ? selectedSubCourtsNames : (selectedSubCourt ? selectedSubCourt.name : (
                    <span className="text-neutral-400 font-black italic">Chưa chọn</span>
                  ))}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-dashed border-neutral-100 pt-2">
                <span className="text-neutral-400 font-bold text-[9px] uppercase tracking-wider">Khung giờ:</span>
                <span className="font-mono font-extrabold text-emerald-600 text-[11px] text-right max-w-[200px] truncate">
                  {selectedSlots.length > 0 ? summarizeSelectedSlotTimes(selectedSlots) : (selectedSlot ? selectedSlot.time : (
                    <span className="text-neutral-400 font-black font-sans italic">Chưa chọn</span>
                  ))}
                </span>
              </div>

              <div className="pt-2.5 border-t border-solid border-neutral-150/70 flex justify-between items-center">
                <span className="text-xs font-black text-neutral-850 bg-transparent">Tổng tạm tính:</span>
                <span className="text-sm font-black text-[rgb(16,185,129)]">
                  {selectedSlots.length > 0 
                    ? `${selectedSlots.reduce((sum, slot) => sum + getSlotPrice(slot), 0).toLocaleString('vi-VN')}đ` 
                    : (selectedSlot ? `${getSlotPrice(selectedSlot).toLocaleString('vi-VN')}đ` : '0đ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm submit CTA button */}
        <div className="bg-white border-t border-neutral-200/50 p-4 shrink-0 flex flex-col">
          <button
            onClick={() => {
              if (selectedSlots.length === 0 && !selectedSlot) return;
              setBookingError(null);
              setShowCheckoutModal(true);
            }}
            disabled={selectedSlots.length === 0 && !selectedSlot}
            className={`w-full py-3.5 rounded-full flex items-center justify-center gap-1.5 transition-all duration-150 text-xs font-black tracking-wide uppercase shadow-md ${
              (selectedSlots.length > 0 || selectedSlot)
                ? 'bg-[rgb(16,185,129)] hover:bg-[rgb(12,168,116)] text-white shadow-emerald-500/20 active:scale-98 cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>Tiếp tục</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    );
  };

  const closeCheckoutFlow = () => {
    setShowCheckoutModal(false);
    setActiveCreatedTicket(null);
    setCreatedPaymentTickets([]);
    setSelectedSlot(null);
    setSelectedSlots([]);
    setBookingError(null);
    setActiveSchedulingCourtId(null);
  };

  return (
    <div id="booking-tab-content" className="flex-1 flex flex-col overflow-hidden select-none animate-fadeIn bg-neutral-50/50 relative">
      {activeSchedulingCourtId !== null ? (
        renderScheduler()
      ) : (
        <>
          {/* 1. Header with Current Location Selector & Search Circle */}
      <div className="bg-white border-b border-neutral-200/50 px-4 py-3 shrink-0 relative z-30 flex justify-between items-center shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Geolocation visual icon wrapper */}
          <button 
            onClick={handleGetLocation}
            className="w-10 h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center transition active:scale-95"
            title="Sử dụng định vị GPS hiện tại"
          >
            <Compass size={18} className={isLocating ? 'animate-spin' : ''} />
          </button>
          
          <div className="text-left relative">
            <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-widest block leading-tight">Vị trí hiện tại</span>
            <div 
              onClick={() => setShowLocationSelect(!showLocationSelect)}
              className="flex items-center gap-1 cursor-pointer select-none group"
            >
              <span className="text-[13px] font-black text-neutral-800 transition group-hover:text-emerald-600 truncate max-w-[170px]">
                {activeLocation}
              </span>
              <span className="text-[8px] text-neutral-400 group-hover:text-emerald-500 transition">▼</span>
            </div>

            {/* Custom Location Dropdown menu */}
            {showLocationSelect && (
              <div className="absolute top-[100%] left-0 mt-2 bg-white border border-neutral-200/80 shadow-xl rounded-2xl p-3 z-50 w-60 text-left animate-scaleUp">
                <p className="text-[9.5px] font-black text-neutral-400 uppercase tracking-widest mb-2">📍 Vị trí gần đây của bạn</p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveLocation('Thạch Thất, Hà Nội');
                      setShowLocationSelect(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-700 block transition cursor-pointer"
                  >
                    🏢 Thạch Thất, Hà Nội
                  </button>
                  <button
                    onClick={() => {
                      setActiveLocation('Xã Bình Yên, Thạch Thất');
                      setShowLocationSelect(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-700 block transition cursor-pointer"
                  >
                    📍 Xã Bình Yên, Thạch Thất
                  </button>
                  <button
                    onClick={() => {
                      setActiveLocation('Hòa Lạc, Thạch Thất');
                      setShowLocationSelect(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-neutral-50 rounded-xl text-xs font-extrabold text-neutral-700 block transition cursor-pointer"
                  >
                    🌲 Hòa Lạc, Thạch Thất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic circular Search Toggle button */}
        <button
          onClick={() => setShowSearchInline(!showSearchInline)}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 cursor-pointer ${
            showSearchInline || searchQuery ? 'bg-emerald-100 text-emerald-600' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
          title="Tìm kiếm sân bóng"
        >
          <Search size={15} />
        </button>
      </div>

      {/* Slide-out or Drop-down input for searches */}
      {showSearchInline && (
        <div className="bg-white border-b border-neutral-100 p-2.5 px-4 shrink-0 animate-fadeIn">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Nhập tên sân đấu, địa chỉ để bắt đầu tìm..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl pl-11 pr-8 py-3 text-xs text-neutral-800 focus:outline-emerald-500 font-semibold"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {!showMyTickets ? (
        <>
          {/* 2. Horizontal Filter category bar (Thanh bộ lọc) */}
          <div className="bg-white px-4 py-2.5 border-b border-neutral-200/50 flex items-center gap-2 shrink-0 relative z-30 select-none">
            {/* Green Lọc action button */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold text-white flex items-center gap-1 transition-all shadow-xs duration-200 cursor-pointer ${
                  (districtQuery !== 'All' || selectedSports.length > 1 || (selectedSports.length === 1 && selectedSports[0] !== sportFilter)) ? 'bg-amber-500' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
                id="filter-loc-btn"
              >
                <span>Lọc{(districtQuery !== 'All' || selectedSports.length > 1 || (selectedSports.length === 1 && selectedSports[0] !== sportFilter)) ? ': Có' : ''}</span>
              </button>

              {/* Advanced multi-select sports selection dialog */}
              {showFilterDropdown && (
                <div className="absolute top-[100%] left-0 mt-2 bg-white border border-neutral-200/80 shadow-2xl rounded-2xl p-3.5 z-50 w-72 text-left animate-slideDown flex flex-col gap-3">
                  <div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {sportsConfig.map(s => {
                        const isSelected = selectedSports.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              toggleSportInFilter(s.id);
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-extrabold border cursor-pointer transition-all duration-150 select-none ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : 'bg-white border-neutral-100 text-neutral-600 hover:bg-neutral-50'
                            }`}
                          >
                            <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center text-[9px] transition-all duration-150 select-none ${
                              isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 bg-neutral-50'
                            }`}>
                              {isSelected ? '✓' : ''}
                            </span>
                            <span className="truncate">{s.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="border-t border-neutral-100 pt-2 flex gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedSports([sportFilter]);
                        setDistrictQuery('All');
                      }}
                      className="flex-1 py-1 px-2 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-lg text-[10px] font-bold text-center cursor-pointer transition"
                    >
                      Đặt lại
                    </button>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold text-center cursor-pointer transition"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Vertical divider line */}
            <div className="h-4 w-[1px] bg-neutral-200 shrink-0"></div>

            {/* Scrolling sport icons tags */}
            <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none py-1">
              {sportsConfig.map(s => {
                const isSelected = sportFilter === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSportFilter(s.id);
                      setSelectedSlot(null);
                      setExpandedCourtId(null);
                      setSelectedSubCourtId(null);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs transition duration-150 border cursor-pointer font-extrabold shrink-0 shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-50/80 text-emerald-700 border-emerald-400/80 bg-emerald-100/30'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Map view vs card-list display selection logic */}
          {showMapView ? (
            /* Immersive Full Screen interactive Vector Map */
            <div 
              id="fullscreen-map-wrapper"
              className="absolute inset-0 bg-[#e5e9f0] z-40 flex flex-col select-none overflow-hidden animate-fadeIn"
            >
              {/* Actual Real-world Interactive Leaflet Map Container */}
              <div className="absolute inset-0 bg-[#e5e9f0]">
                <div 
                  id="leaflet-map-element" 
                  className="w-full h-full z-10 outline-none"
                />
              </div>

              {/* 1. TOP Floated Search Input Box Over Map */}
              <div className="absolute top-4 inset-x-4 z-40 flex items-center gap-2 map-noclick">
                <div className="flex-1 bg-white shadow-xl rounded-2xl border border-neutral-200/50 flex items-center px-4 py-3 gap-2.5">
                  <Search size={20} className="text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sân quanh đây"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-semibold text-neutral-800 placeholder-neutral-400 focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="text-xs font-black text-neutral-400 hover:text-neutral-600 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Recenter Button next to search input on map */}
                <button
                  onClick={handleRecenter}
                  className="w-[45px] h-[45px] shrink-0 bg-emerald-600 border border-emerald-500 shadow-xl rounded-2xl flex items-center justify-center text-white hover:bg-emerald-500 active:scale-95 transition"
                  title="Về vị trí của tôi"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="3" fill="none" className="stroke-current flex items-center justify-center">
                    <circle cx="12" cy="12" r="8" />
                    <line x1="12" y1="1" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="23" />
                    <line x1="1" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="23" y2="12" />
                  </svg>
                </button>

                {/* Satellite Layer Toggle Button */}
                <button
                  onClick={() => setMapStyle((prev: 'classic' | 'satellite') => prev === 'classic' ? 'satellite' : 'classic')}
                  className={`w-[45px] h-[45px] shrink-0 border shadow-xl rounded-2xl flex items-center justify-center active:scale-95 transition cursor-pointer ${
                    mapStyle === 'satellite' 
                      ? 'bg-amber-500 border-amber-400 text-white hover:bg-amber-600' 
                      : 'bg-white border-neutral-200/50 text-neutral-600 hover:bg-neutral-50'
                  }`}
                  title="Thay đổi bản đồ vệ tinh/bản đồ thường"
                >
                  <Layers size={18} />
                </button>
              </div>

              {/* 2. TOP Floated Filter category tags below Search Box */}
              <div className="absolute top-18 inset-x-0 z-40 px-4 flex gap-2 overflow-x-auto scrollbar-none py-2.5 map-noclick [mask-image:linear-gradient(to_right,white_85%,transparent)]">
                {sportsConfig.map(s => {
                  const isSelected = sportFilter === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSportFilter(s.id);
                        setSelectedSlot(null);
                        setExpandedCourtId(null);
                        setSelectedSubCourtId(null);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] transition-all duration-150 border cursor-pointer font-extrabold shrink-0 shadow-md ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/25 scale-102 font-black'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="font-extrabold">Sân {s.name.toLowerCase()}</span>
                    </button>
                  );
                })}
              </div>

              {/* 3. BOTTOM RIGHT Floated Go Back / Return to List screen Button */}
              <div 
                className={`absolute right-4 z-40 map-noclick transition-all duration-300 ${
                  selectedMapCourtId ? 'bottom-[175px]' : 'bottom-4'
                }`}
              >
                <button
                  onClick={() => setShowMapView(false)}
                  className="bg-[rgb(16,185,129)] hover:bg-[rgb(12,168,116)] active:scale-95 text-white rounded-full flex items-center justify-center gap-1.5 px-4 py-2.5 shadow-lg shadow-emerald-500/25 border border-emerald-400/10 cursor-pointer transition-all duration-150 select-none"
                  title="Quay lại đặt sân"
                >
                  <Calendar size={14} className="fill-white/10" />
                  <span className="text-xs font-black tracking-wide font-extrabold">
                    Xem đặt sân
                  </span>
                </button>
              </div>

              {/* 4. Selected Court summary popup card rising dynamically from bottom */}
              {(() => {
                if (!selectedMapCourtId) return null;
                const realId = selectedMapCourtId;
                const originalCourt = filteredCourts.find(c => c.id === realId);
                if (!originalCourt) return null;

                const localized = getLocalizedCourtInfo(realId);
                const resolvedName = originalCourt.name;

                return (
                  <div 
                    className="absolute bottom-4 inset-x-4 bg-white rounded-3xl p-3.5 border border-neutral-200/50 shadow-2xl z-40 text-left animate-slideDown flex flex-col gap-3 map-noclick"
                  >
                    <div className="flex gap-3">
                      <SafeImage
                        src={originalCourt.imageUrl || localized.imageUrl || getSportFallbackImage(originalCourt.sport)}
                        fallbackSrc={getSportFallbackImage(originalCourt.sport)}
                        sportType={originalCourt.sport}
                        alt={resolvedName}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-neutral-100 shadow-3xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                            Khoảng cách: {localized.distance.split(' ')[0]} km
                          </span>
                          <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                            <Star size={10} className="fill-amber-500 stroke-amber-500" />
                            <span className="text-[10px] font-black">{originalCourt.rating}</span>
                            <span className="text-[8px] text-neutral-400 font-bold">({originalCourt.reviewsCount})</span>
                          </div>
                        </div>

                        <h4 className="text-[13px] font-black text-neutral-800 leading-tight mt-1 truncate">
                          {resolvedName}
                        </h4>

                        <p className="text-[9.5px] text-neutral-400 font-extrabold truncate mt-0.5 leading-none">
                          📍 {originalCourt.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-2.5">
                      <div className="flex flex-col">
                        <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-400">Giá chỉ từ</span>
                        <span className="text-xs font-black text-emerald-600">
                          {originalCourt.priceMin.toLocaleString('vi-VN')}đ<span className="text-[9px] font-medium text-neutral-400">/giờ</span>
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedMapCourtId(null)}
                          className="py-1.5 px-3 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 text-[10px] font-black rounded-xl cursor-pointer transition select-none"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => {
                            // Expand selection & toggle to scheduler in list view
                            setExpandedCourtId(realId);
                            setActiveSchedulingCourtId(realId);
                            if (originalCourt.subCourts.length > 0) {
                              setSelectedSubCourtId(originalCourt.subCourts[0].id);
                            }
                            setSportFilter(originalCourt.sport);
                            setShowMapView(false);
                          }}
                          className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl cursor-pointer transition flex items-center gap-1 shadow-md shadow-emerald-500/15"
                        >
                          📅 Đặt sân trực tiếp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Pristine visual Card List layout */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* 3. Section headline layout title */}
              <div className="flex justify-between items-center pb-0.5">
                <h3 className="text-sm font-black text-neutral-800 tracking-tight">
                  Khám phá sân gần đây
                </h3>
              </div>

              {/* Loop and render courts cards based on active parameters */}
              {filteredCourts.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-neutral-200 my-4 shadow-3xs">
                  <p className="text-xs text-neutral-400 font-bold mt-2">Không tìm thấy sân đấu nào thỏa mãn bộ lọc của bạn.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
                  {filteredCourts.map(court => {
                    const isExpanded = expandedCourtId === court.id;
                    const localized = getLocalizedCourtInfo(court.id);

                    return (
                      <div
                        key={court.id}
                        id={`court-item-${court.id}`}
                        className={`w-full bg-white rounded-3xl border transition-all duration-200 relative overflow-hidden flex flex-col hover:shadow-md ${
                          isExpanded ? 'border-emerald-500 ring-1 ring-emerald-500/25 shadow-sm' : 'border-neutral-200/50 shadow-2xs'
                        }`}
                      >
                      {/* Court high quality cover banner clicks to expand scheduling */}
                      <div
                        onClick={() => {
                          setExpandedCourtId(isExpanded ? null : court.id);
                          setSelectedSlot(null);
                          if (!isExpanded && court.subCourts.length > 0) {
                            setSelectedSubCourtId(court.subCourts[0].id);
                          }
                        }}
                        className="cursor-pointer group"
                      >
                        <div className="relative h-36 w-full overflow-hidden">
                          <SafeImage
                            src={localized.imageUrl || getSportFallbackImage(court.sport)}
                            fallbackSrc={getSportFallbackImage(court.sport)}
                            sportType={court.sport}
                            alt={localized.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          {/* Rating badge position on top right */}
                          <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs text-neutral-800 font-bold px-2 py-0.5 rounded-lg text-[9.5px] flex items-center gap-0.5 shadow-xs">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            <span>{court.rating}</span>
                          </div>
                        </div>

                        {/* Title & metadata content information block */}
                        <div className="p-4 text-left">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="text-[13px] font-black text-neutral-800 leading-snug truncate">
                              {localized.name}
                            </h4>
                            <span className="text-emerald-600 text-[12.5px] font-black shrink-0">
                              {localized.priceLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-medium mt-1">
                            <MapPin size={10} className="text-neutral-400 shrink-0" />
                            <span>{localized.distance}</span>
                          </div>

                          {/* Customized bottom labels tags row matches wireframe perfectly */}
                          <div className="flex gap-1.5 mt-3 flex-wrap">
                            {localized.tags.map(t => (
                              <span 
                                key={t} 
                                className="bg-neutral-100 text-neutral-500 rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Expanded time-grids slot calendar scheduler picker */}
                      {isExpanded && (
                        <div className="border-t border-neutral-100 p-4 bg-neutral-50/70 space-y-3.5 animate-fadeIn text-left">
                          {/* Court Description / Summary Section */}
                          <p className="text-[10.5px] text-neutral-400 leading-relaxed font-semibold text-left border-l-2 border-neutral-250 pl-2.5">
                            {court.description}
                          </p>
                          
                          {/* Dedicated Reviews, Voting & Star Ratings block */}
                          {(() => {
                            const getCourtReviews = (id: string) => {
                              const list: Record<string, Array<{ author: string; rating: number; comment: string; date: string }>> = {
                                'court-1': [
                                  { author: 'Hùng Anh', rating: 5, comment: 'Cỏ sân rất mượt, mịn bám sân tốt, đèn chiếu sáng cực kỳ đầy đủ dồi dào!', date: 'Hôm qua' },
                                  { author: 'Quốc Bảo', rating: 4.5, comment: 'Chủ sân hiếu khách nhiệt tình, giữ xe máy ô tô rộng rãi miễn phí.', date: '3 ngày trước' }
                                ],
                                'court-2': [
                                  { author: 'Thuận Phát', rating: 5, comment: 'Thảm PVC xịn bám đế giày, trần siêu cao rộng thoáng chơi rất đã tay.', date: 'Hôm nay' },
                                  { author: 'Minh Hằng', rating: 4, comment: 'Có quạt hút gió nên mát mẻ lắm, dịch vụ cho thuê vợt chu đáo.', date: '5 ngày trước' }
                                ],
                                'court-3': [
                                  { author: 'Lâm Hoàng', rating: 5, comment: 'Mặt sơn hoàn thiện nẩy bóng chuẩn xác, lưới căng chuẩn độ cao quốc tế.', date: 'Hôm qua' },
                                  { author: 'Cẩm Tú', rating: 5, comment: 'Sân trung tâm Thạch Thất di chuyển thuận lợi, sạch sẽ, văn minh.', date: 'Hôm kia' }
                                ]
                              };

                              return list[id] || [
                                { author: 'Tuấn Đạt', rating: 5, comment: 'Phục vụ tận tâm chu đáo, cơ sở hạ tầng cực kỳ khang trang sạch sẽ!', date: 'Hôm qua' },
                                { author: 'Mai Hương', rating: 4.5, comment: 'Đặt sân qua trực tuyến siêu nhanh, không mất thời gian chờ xếp hàng.', date: '3 ngày trước' }
                              ];
                            };

                            const reviews = getCourtReviews(court.id);
                            const avgRating = court.rating || 4.8;

                            return (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center bg-neutral-100/50 p-2 rounded-xl border border-neutral-150">
                                  <span className="text-[9.5px] text-neutral-500 font-extrabold uppercase tracking-wider">
                                    ⭐ Đánh giá & Phản hồi
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <div className="flex gap-0.5">
                                      {Array.from({ length: 5 }).map((_, sI) => (
                                        <Star
                                          key={sI}
                                          size={8}
                                          className={`${
                                            sI < Math.floor(avgRating) 
                                              ? 'fill-amber-400 text-amber-400' 
                                              : 'text-neutral-200'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[10px] font-black text-neutral-800">
                                      {avgRating.toFixed(1)}/5.0 ({12 + (court.name.length % 15)} vote)
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-[145px] overflow-y-auto pr-0.5 scrollbar-thin">
                                  {reviews.map((rev, rIdx) => (
                                    <div key={rIdx} className="bg-white rounded-2xl border border-neutral-200/60 p-2.5 space-y-1 shadow-3xs">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] font-black text-emerald-700 uppercase shrink-0">
                                            {rev.author.charAt(0)}
                                          </div>
                                          <span className="text-[10px] font-bold text-neutral-805 truncate max-w-[90px]">{rev.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, sI) => (
                                              <Star
                                                key={sI}
                                                size={7}
                                                className={`${
                                                  sI < Math.floor(rev.rating) 
                                                    ? 'fill-amber-450 text-amber-400' 
                                                    : 'text-neutral-200'
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          <span className="text-[8.5px] text-neutral-400 font-medium">{rev.date}</span>
                                        </div>
                                      </div>
                                      <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold pl-1">
                                        "{rev.comment}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Booking trigger CTA equivalent to design of Map floating bubble */}
                          <div className="pt-1.5">
                            <button
                              id={`btn-inline-book-now-${court.id}`}
                              onClick={() => {
                                setBookingError(null);
                                setActiveSchedulingCourtId(court.id);
                                setExpandedCourtId(court.id);
                                if (court.subCourts.length > 0) {
                                  setSelectedSubCourtId(court.subCourts[0].id);
                                }
                                setSelectedSlot(null);
                              }}
                              className="w-full bg-[rgb(16,185,129)] hover:bg-[rgb(12,168,116)] active:scale-95 text-white rounded-full flex items-center justify-center gap-1.5 px-4 py-2.5 shadow-lg shadow-emerald-500/25 border border-emerald-400/10 cursor-pointer transition-all duration-150 select-none text-xs font-black tracking-wide"
                            >
                              <Calendar size={14} className="fill-white/10 shrink-0" />
                              Đặt sân ngay
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          )}

          {/* Sticky checkout reservation drawer panel at bottom */}
          {selectedSlot && expandedCourtId && (
            <div
              id="sticky-checkout-panel"
              className="bg-neutral-900 text-white p-3 px-4 shadow-2xl border-t border-neutral-800 sticky bottom-0 z-40 flex items-center justify-between"
            >
              <div>
                <span className="text-[8px] uppercase tracking-wider text-neutral-400 block font-bold">1 Khung Giờ Được Chọn</span>
                <p className="text-[10px] font-bold text-neutral-100 truncate max-w-[180px]">
                  {courts.find(c => c.id === expandedCourtId)?.name}
                </p>
                <p className="text-[11px] font-extrabold text-emerald-400">
                  {getSlotPrice(selectedSlot).toLocaleString('vi-VN')} VND
                </p>
              </div>

              <button
                id="checkout-book-btn"
                onClick={() => {
                  setBookingError(null);
                  setShowCheckoutModal(true);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow-lg animate-pulse"
              >
                Tiếp tục đặt ➔
              </button>
            </div>
          )}

          {/* Absolute bottom floating action "Xem bản đồ" button */}
          {!showMapView && (
            <button
              onClick={() => setShowMapView(!showMapView)}
              className="absolute bottom-4 right-4 z-40 bg-[rgb(16,185,129)] hover:bg-[rgb(12,168,116)] active:scale-95 text-white rounded-full flex items-center justify-center gap-1.5 px-4 py-2.5 shadow-lg shadow-emerald-500/25 border border-emerald-400/10 cursor-pointer transition-all duration-150 select-none"
            >
              <Map size={14} className="fill-white/10" />
              <span className="text-xs font-black tracking-wide">
                Xem bản đồ
              </span>
            </button>
          )}
        </>
      ) : (
        /* My Tickets section */
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <h3 className="text-xs font-black text-neutral-700 tracking-tight uppercase flex items-center gap-1">
            🎫 Vé tập luyện & Đặt Sân của bạn
          </h3>

          {userBookings.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-neutral-200">
              <span className="text-3xl">🎫</span>
              <p className="text-xs text-neutral-400 font-bold mt-2">Bạn chưa từng đặt sân nào.</p>
              <button
                onClick={() => setShowMyTickets(false)}
                className="mt-3 text-[10px] text-white bg-emerald-600 px-3 py-1.5 rounded-lg font-bold"
              >
                Đặt lướt ngay sân trống!
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userBookings.map(b => {
                const statusMeta = getBookingStatusMeta(b);
                return (
                <div
                  key={b.id}
                  className={`bg-white rounded-2xl border overflow-hidden p-3 shadow-2xs space-y-3 ${
                    statusMeta.active ? 'border-neutral-200' : 'border-neutral-100 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5/2">
                      <span className="text-xl">
                        {b.sport === 'soccer' ? '⚽' : b.sport === 'badminton' ? '🏸' : b.sport === 'tennis' ? '🎾' : '🏀'}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-neutral-800 leading-tight">{b.courtName}</h4>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5">{b.subCourtName}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="bg-neutral-50 px-3 py-2 rounded-xl grid grid-cols-2 gap-2 text-[10px] text-neutral-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={11} className="text-neutral-400" />
                      <span>{b.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} className="text-neutral-400" />
                      <span className="font-semibold text-neutral-800">{b.timeSlot}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-between border-t border-neutral-100 pt-2">
                      <span className="text-neutral-400 font-bold uppercase text-[8px]">Tổng tiền</span>
                      <span className="font-black text-emerald-600">{b.price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[9px]">
                    <span className="font-black text-blue-600 select-all">{b.bookingCode}</span>
                    {canReopenPayment(b) && (
                      <button
                        onClick={() => {
                          setActiveCreatedTicket(b);
                          setCreatedPaymentTickets([b]);
                          setBookingError(null);
                          setShowCheckoutModal(true);
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-black px-2.5 py-1.5 rounded-lg transition"
                      >
                        Xem lại mã QR thanh toán
                      </button>
                    )}
                  </div>

                  {b.status === 'confirmed' && (
                    <div className="pt-2.5 border-t border-neutral-100 flex flex-col items-center space-y-2">
                      {/* Ticket Gate Pass Visual details */}
                      <div className="bg-neutral-900 text-emerald-400 p-2 text-center rounded-lg font-mono text-[9px] tracking-wide w-full select-all">
                        CODE: {b.qrcode}
                      </div>

                      <div className="flex items-center justify-between w-full text-[9px]">
                        <button
                          onClick={() => {
                            if (confirm('Bạn có đồng ý hủy lịch đặt sân này không? Khoản hoàn tiền (nếu có) sẽ được SportRes xử lý qua chuyển khoản.')) {
                              cancelBooking(b.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 font-black cursor-pointer hover:underline"
                        >
                          Hủy sân hoàn tiền
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </>
    )}

      {/* Checkout Selection Modal */}
      {showCheckoutModal && (activeCreatedTicket || selectedSlot || selectedSlots.length > 0) && (() => {
        const totalSlotsPrice = selectedSlots.length > 0 
          ? selectedSlots.reduce((sum, slot) => sum + getSlotPrice(slot), 0)
          : (selectedSlot ? getSlotPrice(selectedSlot) : 0);
        const checkoutFinalPrice = totalSlotsPrice + extrasPrice;

        const displaySubCourtName = selectedSlots.length > 0 
          ? selectedSlots.map(slot => {
              const c = courts.find(court => court.id === expandedCourtId);
              const sub = c?.subCourts.find(sc => sc.id === slot.court_id);
              return sub?.name || '';
            }).filter((v, idx, arr) => arr.indexOf(v) === idx).join(', ')
          : (courts.find(c => c.id === expandedCourtId)?.subCourts.find(s => s.id === selectedSubCourtId)?.name || 'Chưa chọn');

        const displayTime = selectedSlots.length > 0 
          ? summarizeSelectedSlotTimes(selectedSlots)
          : (selectedSlot ? selectedSlot.time : '');

        return (
          <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl border border-neutral-100 space-y-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-black text-neutral-800 uppercase flex items-center gap-1">
                  <Receipt size={14} className="text-emerald-600" /> Hóa Đơn Chi Tiết Đặt Sân
                </h3>
                <button onClick={closeCheckoutFlow} className="text-neutral-400 hover:text-neutral-600 font-bold">✕</button>
              </div>

              {!activeCreatedTicket ? (
                <>
                  {/* Court Description Details */}
                  <div className="bg-neutral-50 p-2.5 rounded-xl text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Cơ sở:</span>
                      <span className="font-extrabold text-neutral-800 text-right max-w-[200px] truncate">
                        {courts.find(c => c.id === expandedCourtId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Phân sân:</span>
                      <span className="font-bold text-emerald-700">
                        {displaySubCourtName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Thời gian:</span>
                      <span className="font-bold text-neutral-800 bg-neutral-200/50 px-1 rounded">{displayTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Ngày đặt:</span>
                      <span className="font-bold text-neutral-800">{selectedDate}</span>
                    </div>
                  </div>

                  {/* Additional services and extras */}
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-wide">Dịch vụ bổ sung thêm (Tùy chọn)</h4>
                    
                    {/* Water rental */}
                    <div className="flex justify-between items-center bg-white border border-neutral-100 p-2 rounded-xl">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-neutral-800 block">Nước suối lốc Aquafina</span>
                        <span className="text-[9px] text-neutral-400">10,000 VND / chai ướp lạnh</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNumWater(Math.max(0, numWater - 1))}
                          className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center font-extrabold text-neutral-600 hover:bg-neutral-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-neutral-800">{numWater}</span>
                        <button
                          onClick={() => setNumWater(numWater + 1)}
                          className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center font-extrabold text-neutral-600 hover:bg-neutral-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Rackets rental */}
                    <div className="flex justify-between items-center bg-white border border-neutral-100 p-2 rounded-xl">
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-neutral-800 block">Thuê vợt/vật phẩm phụ trợ</span>
                        <span className="text-[9px] text-neutral-400">25,000 VND / bộ / giờ tập</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNumRackets(Math.max(0, numRackets - 1))}
                          className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center font-extrabold text-neutral-600 hover:bg-neutral-200"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-neutral-800">{numRackets}</span>
                        <button
                          onClick={() => setNumRackets(numRackets + 1)}
                          className="w-5 h-5 rounded bg-neutral-100 flex items-center justify-center font-extrabold text-neutral-600 hover:bg-neutral-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal calculations */}
                  <div className="pt-2 border-t border-neutral-100 space-y-1 text-[10px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Giá trị slot gốc:</span>
                      <span>{totalSlotsPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {extrasPrice > 0 && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Phụ phí thêm:</span>
                        <span>{extrasPrice.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className="flex justify-between text-neutral-800 font-extrabold text-xs pt-1 border-t border-dashed border-neutral-100">
                      <span>Tổng hóa đơn thanh toán:</span>
                      <span className="text-emerald-600">{checkoutFinalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl text-[10px] text-blue-700">
                    Booking sẽ được giữ chỗ để bạn chuyển khoản qua QR MB Bank. SportRes chỉ xác nhận sân sau khi admin kiểm tra giao dịch.
                  </div>

                  {/* Validation errors */}
                  {bookingError && (
                    <p className="text-[9px] text-red-500 font-bold text-center">{bookingError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={closeCheckoutFlow}
                      className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Quay lại
                    </button>
                    <button
                      onClick={handleCheckoutSubmit}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-md"
                    >
                      Tạo booking &amp; lấy QR
                    </button>
                  </div>
                </>
              ) : (
                <BookingPaymentDetails
                  booking={{
                    ...activeCreatedTicket,
                    price: createdPaymentTickets.reduce((sum, ticket) => sum + ticket.price, 0),
                  }}
                  error={bookingError}
                  positionLabel={createdPaymentTickets.length > 1
                    ? `${createdPaymentTickets.length} khung giờ`
                    : undefined}
                  onConfirm={async () => {
                    try {
                      await confirmBookingTransfer(activeCreatedTicket.id);
                      const updatedTickets = createdPaymentTickets.map(ticket => ({
                        ...ticket,
                        paymentStatus: 'waiting_admin_confirmation' as const,
                      }));
                      setCreatedPaymentTickets(updatedTickets);
                      setActiveCreatedTicket(updatedTickets[0]);
                      setBookingError(null);
                    } catch (error: any) {
                      setBookingError(error.message);
                    }
                  }}
                />
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
