import { formatISTDate } from "@/utils/istDate";

/**
 * Utility functions for formatting dates and times
 * Eliminates duplication across EventReview and SessionPlanning components
 */

/**
 * Format a date string to a localized readable format
 */
export const formatDate = (dateString: string, language: 'en' | 'ta' = 'en'): string => {
  if (!dateString) return '';
  try {
    return formatISTDate(dateString, language === 'en' ? 'en-IN' : 'ta-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

/**
 * Format a time string to 12-hour format with AM/PM
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Format currency values with proper locale
 */
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toLocaleString()}`;
};
