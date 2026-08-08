/** Shared brochure call-date helpers (client and server). */

const DAY_MS = 24 * 60 * 60 * 1000;
const SELECTABLE_WINDOW_DAYS = 60;

export const TIME_BANDS = ['Morning', 'Afternoon', 'Early evening'] as const;
export type TimeBand = (typeof TIME_BANDS)[number];

export function isTimeBand(value: unknown): value is TimeBand {
  return (
    typeof value === 'string' &&
    (TIME_BANDS as readonly string[]).includes(value)
  );
}

export function timeBandLowercase(band: TimeBand): string {
  return band.toLowerCase();
}

/** Local calendar date at midnight. */
export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/** First working day strictly after `from` (local). */
export function nextWorkingDay(from: Date = new Date()): Date {
  let cursor = startOfLocalDay(from);
  cursor = new Date(cursor.getTime() + DAY_MS);
  while (isWeekend(cursor)) {
    cursor = new Date(cursor.getTime() + DAY_MS);
  }
  return cursor;
}

/** Last calendar day in the selectable window (today + 60 days, local). */
export function maxSelectableCalendarDay(from: Date = new Date()): Date {
  const start = startOfLocalDay(from);
  return new Date(start.getTime() + SELECTABLE_WINDOW_DAYS * DAY_MS);
}

export function minSelectableDate(from: Date = new Date()): Date {
  return nextWorkingDay(from);
}

export function isSelectableWorkingDay(
  iso: string,
  now: Date = new Date(),
): boolean {
  const date = parseIsoDate(iso);
  if (!date) return false;
  if (!isWeekday(date)) return false;
  const min = minSelectableDate(now);
  const max = maxSelectableCalendarDay(now);
  const t = startOfLocalDay(date).getTime();
  return t >= min.getTime() && t <= max.getTime();
}

export function formatUkLongDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatUkLongDateFromDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatLondonTimestamp(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}

/** UK phone: optional +44 or leading 0, spaces allowed, 9–10 digits after prefix. */
export function isValidUkPhone(input: string): boolean {
  const cleaned = input.replace(/\s+/g, '');
  return /^(?:\+44|0)\d{9,10}$/.test(cleaned);
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Monday = 0 … Sunday = 6 for grid columns. */
export function mondayBasedWeekday(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}
