import { CheckCircle } from 'lucide-react';
import { Booking } from '../types';

export const PAYMENT_BANK_INFO = {
  bankName: 'MBBank',
  accountNumber: '3386558805',
  accountHolder: 'Nguyen Minh Quan',
  qrImageUrl: 'https://img.vietqr.io/image/MB-3386558805-compact.png',
} as const;

type BookingPaymentDetailsProps = {
  booking: Booking;
  onConfirm: () => Promise<void>;
  error?: string | null;
  positionLabel?: string;
};

export const BookingPaymentDetails = ({
  booking,
  onConfirm,
  error,
  positionLabel,
}: BookingPaymentDetailsProps) => {
  const waitingForAdmin = booking.paymentStatus === 'waiting_admin_confirmation';
  const paymentAmount = booking.bookingGroupTotal || booking.price;
  const qrImageUrl = `${PAYMENT_BANK_INFO.qrImageUrl}?amount=${encodeURIComponent(paymentAmount)}&addInfo=${encodeURIComponent(booking.bookingCode)}`;

  return (
    <div className="space-y-4 text-center py-2 animate-scaleUp">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 select-none">
        <CheckCircle size={28} />
      </div>
      <h4 className="text-xs font-black text-emerald-600 uppercase tracking-wider">Chuyển khoản đặt sân</h4>
      {positionLabel && <p className="text-[9px] font-bold text-neutral-400">{positionLabel}</p>}

      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
        <img
          src={qrImageUrl}
          alt="QR chuyển khoản MBBank"
          className="w-44 h-44 object-contain mx-auto rounded-xl bg-white"
        />
        <div className="grid grid-cols-2 gap-2 text-[10px] text-left">
          <span className="text-neutral-400">Mã booking</span>
          <span className="font-black text-blue-600 text-right select-all">{booking.bookingCode}</span>
          <span className="text-neutral-400">Ngân hàng</span>
          <span className="font-black text-right">{PAYMENT_BANK_INFO.bankName}</span>
          <span className="text-neutral-400">Số tài khoản</span>
          <span className="font-black text-right select-all">{PAYMENT_BANK_INFO.accountNumber}</span>
          <span className="text-neutral-400">Chủ tài khoản</span>
          <span className="font-black text-right">{PAYMENT_BANK_INFO.accountHolder}</span>
          <span className="text-neutral-400">Số tiền</span>
          <span className="font-black text-emerald-600 text-right">{paymentAmount.toLocaleString('vi-VN')}đ</span>
          <span className="text-neutral-400">Nội dung</span>
          <span className="font-black text-blue-600 text-right select-all">{booking.bookingCode}</span>
        </div>
      </div>

      {error && <p className="text-[9px] text-red-500 font-bold">{error}</p>}
      <button
        onClick={onConfirm}
        disabled={waitingForAdmin}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-300 text-white rounded-xl text-xs font-bold transition cursor-pointer"
      >
        {waitingForAdmin ? 'Đang chờ SportRes xác nhận' : 'Tôi đã thanh toán'}
      </button>
      {waitingForAdmin && (
        <p className="text-[10px] text-amber-700 bg-amber-50 rounded-xl p-3">
          Yêu cầu đặt sân của bạn đang chờ SportRes xác nhận thanh toán.
        </p>
      )}
    </div>
  );
};
