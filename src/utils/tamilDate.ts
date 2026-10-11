import { isValidISODate } from "@/utils/istDate";

const TAMIL_MONTHS = [
  "சித்திரை",
  "வைகாசி",
  "ஆனி",
  "ஆடி",
  "ஆவணி",
  "புரட்டாசி",
  "ஐப்பசி",
  "கார்த்திகை",
  "மார்கழி",
  "தை",
  "மாசி",
  "பங்குனி",
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const ANAMALAI_LATITUDE = 10.583;
const ANAMALAI_LONGITUDE = 76.934;
const SUNRISE_ZENITH = 90.833;

function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

function solarSiderealLongitude(timestamp: number): number {
  const julianDay = timestamp / DAY_MS + 2440587.5;
  const centuries = (julianDay - 2451545) / 36525;
  const meanLongitude = normalizeDegrees(
    280.46646 + 36000.76983 * centuries + 0.0003032 * centuries ** 2,
  );
  const meanAnomaly =
    (357.52911 + 35999.05029 * centuries - 0.0001537 * centuries ** 2) *
    (Math.PI / 180);
  const equationOfCenter =
    (1.914602 - 0.004817 * centuries - 0.000014 * centuries ** 2) *
      Math.sin(meanAnomaly) +
    (0.019993 - 0.000101 * centuries) * Math.sin(2 * meanAnomaly) +
    0.000289 * Math.sin(3 * meanAnomaly);
  const omega = (125.04 - 1934.136 * centuries) * (Math.PI / 180);
  const tropicalLongitude =
    meanLongitude + equationOfCenter - 0.00569 - 0.00478 * Math.sin(omega);
  const year = new Date(timestamp).getUTCFullYear();
  const lahiriAyanamsa = 23.8531 + (year - 2000) * 0.013968;

  return normalizeDegrees(tropicalLongitude - lahiriAyanamsa);
}

function sunriseInIndia(year: number, month: number, day: number): number {
  const dayOfYear = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / DAY_MS,
  );
  const latitudeRadians = (ANAMALAI_LATITUDE * Math.PI) / 180;
  const longitudeHour = ANAMALAI_LONGITUDE / 15;
  const approximateTime = dayOfYear + (6 - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const meanAnomalyRadians = (meanAnomaly * Math.PI) / 180;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      1.916 * Math.sin(meanAnomalyRadians) +
      0.02 * Math.sin(2 * meanAnomalyRadians) +
      282.634,
  );
  const longitudeRadians = (trueLongitude * Math.PI) / 180;
  let rightAscension =
    (Math.atan(0.91764 * Math.tan(longitudeRadians)) * 180) / Math.PI;
  rightAscension = normalizeDegrees(rightAscension);
  rightAscension += Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin(longitudeRadians);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const cosHourAngle =
    (Math.cos((SUNRISE_ZENITH * Math.PI) / 180) -
      sinDeclination * Math.sin(latitudeRadians)) /
    (cosDeclination * Math.cos(latitudeRadians));
  if (cosHourAngle < -1 || cosHourAngle > 1) return Number.NaN;

  const hourAngle = (360 - (Math.acos(cosHourAngle) * 180) / Math.PI) / 15;
  const localMeanTime =
    hourAngle + rightAscension - 0.06571 * approximateTime - 6.622;
  const utcHour = ((localMeanTime - longitudeHour) % 24 + 24) % 24;

  return Date.UTC(year, month - 1, day) + utcHour * 60 * 60 * 1000;
}

/**
 * Converts a Gregorian date to its Tamil solar date using sunrise in Anaimalai.
 * Tamil solar days change at sunrise, not at midnight.
 */
export function getTamilSolarDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match || !isValidISODate(isoDate)) return "";

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const dateAtNoon = Date.UTC(year, month - 1, day, 6, 30);
  const sunrise = sunriseInIndia(year, month, day);
  if (Number.isNaN(sunrise)) return "";
  const solarMonth = Math.floor(solarSiderealLongitude(sunrise) / 30);
  let dayOfMonth = 1;

  for (let offset = 1; offset <= 35; offset += 1) {
    const previousDate = new Date(Date.UTC(year, month - 1, day - offset));
    const previousSunrise = sunriseInIndia(
      previousDate.getUTCFullYear(),
      previousDate.getUTCMonth() + 1,
      previousDate.getUTCDate(),
    );
    const previousMonth = Math.floor(solarSiderealLongitude(previousSunrise) / 30);
    if (previousMonth !== solarMonth) break;
    dayOfMonth += 1;
  }
  const weekdays = [
    "ஞாயிற்றுக்கிழமை",
    "திங்கட்கிழமை",
    "செவ்வாய்க்கிழமை",
    "புதன்கிழமை",
    "வியாழக்கிழமை",
    "வெள்ளிக்கிழமை",
    "சனிக்கிழமை",
  ];
  const weekday = weekdays[new Date(dateAtNoon).getUTCDay()];

  return `${dayOfMonth} - ${TAMIL_MONTHS[solarMonth]}, ${weekday}`;
}
