const IST_NOON_UTC = "T06:30:00.000Z";
const DAY_MS = 24 * 60 * 60 * 1000;

export function dateAtISTNoon(date: string): Date {
  return new Date(`${date}${IST_NOON_UTC}`);
}

export function isValidISODate(date: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return false;
  const [, year, month, day] = match;
  const value = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    value.getUTCFullYear() === Number(year) &&
    value.getUTCMonth() === Number(month) - 1 &&
    value.getUTCDate() === Number(day)
  );
}

export function formatISTDate(
  date: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!isValidISODate(date)) return date;
  const value = dateAtISTNoon(date);
  if (Number.isNaN(value.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: "Asia/Kolkata",
  }).format(value);
}

export function getISTDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  }).formatToParts(now);
  const dateParts = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export function addDaysToISODate(date: string, days: number): string {
  if (!isValidISODate(date)) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return "";
  const [, year, month, day] = match;
  const value = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + days));
  return [
    value.getUTCFullYear(),
    String(value.getUTCMonth() + 1).padStart(2, "0"),
    String(value.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function differenceInCalendarDays(startDate: string, endDate: string): number {
  if (!isValidISODate(startDate) || !isValidISODate(endDate)) return 0;
  const start = dateAtISTNoon(startDate);
  const end = dateAtISTNoon(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}
