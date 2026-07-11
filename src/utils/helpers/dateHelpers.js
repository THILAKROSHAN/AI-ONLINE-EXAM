// Date Helpers
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const formatDateShort = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateLong = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTimeShort = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeShort = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Time';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();
};

export const isYesterday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
};

export const isThisWeek = (date) => {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return d >= weekStart && d <= weekEnd;
};

export const isThisMonth = (date) => {
  if (!date) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  return d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
};

export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const addYears = (date, years) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
};

export const getDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const getAge = (birthDate) => {
  if (!birthDate) return null;
  const bDate = new Date(birthDate);
  if (isNaN(bDate.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - bDate.getFullYear();
  const m = now.getMonth() - bDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < bDate.getDate())) {
    age--;
  }
  return age;
};

export default {
  parseDate,
  isValidDate,
  formatDateShort,
  formatDateLong,
  formatDateTimeShort,
  formatTimeShort,
  getRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  addDays,
  addMonths,
  addYears,
  getDateRange,
  getAge,
};