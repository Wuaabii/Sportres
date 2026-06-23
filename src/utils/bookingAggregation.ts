import { Booking } from '../types';

export type GroupedBookingHistoryItem = Booking & {
  bookingIds: string[];
  timeSlotIds: string[];
};

export type AggregatedBooking = GroupedBookingHistoryItem;

type ParsedTimeRange = {
  start: number;
  end: number;
};

const parseTimeRange = (timeSlot: string): ParsedTimeRange | null => {
  const match = timeSlot.match(/^\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})\s*$/);
  if (!match) return null;
  const start = Number(match[1]) * 60 + Number(match[2]);
  const end = Number(match[3]) * 60 + Number(match[4]);
  return end > start ? { start, end } : null;
};

const formatMinutes = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

export const combineConsecutiveTimeRanges = (timeSlots: string[]) => {
  const sortedRanges = timeSlots
    .map(timeSlot => ({ timeSlot, range: parseTimeRange(timeSlot) }))
    .sort((left, right) => (left.range?.start ?? Number.MAX_SAFE_INTEGER) - (right.range?.start ?? Number.MAX_SAFE_INTEGER));
  const combined: string[] = [];

  sortedRanges.forEach(item => {
    if (!item.range) {
      combined.push(item.timeSlot);
      return;
    }
    const previous = combined.at(-1);
    const previousRange = previous ? parseTimeRange(previous) : null;
    if (previousRange?.end === item.range.start) {
      combined[combined.length - 1] = `${formatMinutes(previousRange.start)} - ${formatMinutes(item.range.end)}`;
    } else {
      combined.push(`${formatMinutes(item.range.start)} - ${formatMinutes(item.range.end)}`);
    }
  });

  return combined.join(', ');
};

const historyGroupKey = (booking: Booking) => [
  booking.bookingCode,
  booking.customerId || '',
  booking.venueId || booking.courtId,
  booking.subCourtId,
  booking.date,
  booking.status,
].join('|');

const toHistoryItem = (booking: Booking): GroupedBookingHistoryItem => ({
  ...booking,
  participants: booking.participants.map(participant => ({ ...participant })),
  bookingIds: [booking.id],
  timeSlotIds: [booking.timeSlotId],
});

export const createGroupedBookingHistory = (bookings: readonly Booking[]): GroupedBookingHistoryItem[] => {
  const displayEligible = bookings.filter(
    booking => booking.status === 'confirmed' || booking.status === 'completed',
  );
  const nonGrouped = bookings.filter(
    booking => booking.status !== 'confirmed' && booking.status !== 'completed',
  );
  const groupedByKey = new Map<string, Booking[]>();

  displayEligible.forEach(booking => {
    const key = historyGroupKey(booking);
    groupedByKey.set(key, [...(groupedByKey.get(key) || []), booking]);
  });

  const result: GroupedBookingHistoryItem[] = nonGrouped.map(toHistoryItem);

  groupedByKey.forEach(group => {
    const sorted = [...group].sort((left, right) => {
      const leftRange = parseTimeRange(left.timeSlot);
      const rightRange = parseTimeRange(right.timeSlot);
      return (leftRange?.start ?? Number.MAX_SAFE_INTEGER) - (rightRange?.start ?? Number.MAX_SAFE_INTEGER);
    });
    const groupResult: GroupedBookingHistoryItem[] = [];

    sorted.forEach(booking => {
      const currentRange = parseTimeRange(booking.timeSlot);
      const previous = groupResult.at(-1);
      const previousRange = previous ? parseTimeRange(previous.timeSlot) : null;

      if (currentRange && previous && previousRange?.end === currentRange.start) {
        previous.timeSlot = `${formatMinutes(previousRange.start)} - ${formatMinutes(currentRange.end)}`;
        previous.price += booking.price;
        previous.bookingIds = [...previous.bookingIds, booking.id];
        previous.timeSlotIds = [...previous.timeSlotIds, booking.timeSlotId];
        previous.isMatchBooking = previous.isMatchBooking || booking.isMatchBooking;
        previous.participants = [
          ...previous.participants,
          ...booking.participants
            .filter(participant => !previous.participants.some(existing => existing.id === participant.id))
            .map(participant => ({ ...participant })),
        ];
        previous.participantCount = previous.participants.length || Math.max(previous.participantCount, booking.participantCount);
        previous.reviewPlayers = previous.participantCount > 1;
        if (new Date(booking.createdAt) > new Date(previous.createdAt)) previous.createdAt = booking.createdAt;
        return;
      }

      groupResult.push(toHistoryItem(booking));
    });

    result.push(...groupResult);
  });

  return result.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
};
