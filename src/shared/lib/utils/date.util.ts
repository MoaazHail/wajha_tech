/**
 * Calendar days travel as `YYYY-MM-DD` strings. They are built and read in local
 * time, so the day a visitor clicks is the day that is sent, with no timezone shift.
 */

const pad = (value: number) => String(value).padStart(2, "0");

export const toDayString = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** `2026-11-11` → local midnight of that day, or null when it is not a real date. */
export function parseDay(day: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (!match) return null;

  const [year, month, date] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const parsed = new Date(year, month - 1, date);
  const real = parsed.getFullYear() === year && parsed.getMonth() === month - 1 && parsed.getDate() === date;
  return real ? parsed : null;
}

export const today = () => toDayString(new Date());

export function addDays(day: string, amount: number) {
  const parsed = parseDay(day) ?? new Date();
  parsed.setDate(parsed.getDate() + amount);
  return toDayString(parsed);
}

/** Gregorian calendar with western digits, to match how numbers are shown across the site. */
const LOCALE = "ar-SA-u-ca-gregory-nu-latn";

export function formatDayLong(day: string) {
  const parsed = parseDay(day);
  return parsed ? new Intl.DateTimeFormat(LOCALE, { dateStyle: "full" }).format(parsed) : day;
}

export const formatMonth = (year: number, month: number) =>
  new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }).format(new Date(year, month, 1));

/** Weekday names starting from `weekStartsOn` (0 = Sunday). */
export function weekdayNames(weekStartsOn = 0, style: "short" | "narrow" | "long" = "short") {
  const formatter = new Intl.DateTimeFormat(LOCALE, { weekday: style });
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, index) => formatter.format(new Date(2023, 0, 1 + ((index + weekStartsOn) % 7))));
}
