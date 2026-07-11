// Array Helpers
export const chunk = (array, size) => {
  if (!Array.isArray(array)) return [];
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = (array) => {
  if (!Array.isArray(array)) return [];
  return [...new Set(array)];
};

export const uniqueBy = (array, key) => {
  if (!Array.isArray(array)) return [];
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return [];
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;
    if (typeof aVal === 'string') {
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return order === 'asc' ? aVal - bVal : bVal - aVal;
  });
};

export const filterBy = (array, key, value) => {
  if (!Array.isArray(array)) return [];
  return array.filter(item => item[key] === value);
};

export const searchInArray = (array, searchTerm, fields) => {
  if (!Array.isArray(array)) return [];
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field);
      return value && String(value).toLowerCase().includes(term);
    });
  });
};

export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const pluck = (array, key) => {
  if (!Array.isArray(array)) return [];
  return array.map(item => item[key]);
};

export const sum = (array, key = null) => {
  if (!Array.isArray(array)) return 0;
  if (key) {
    return array.reduce((total, item) => total + (item[key] || 0), 0);
  }
  return array.reduce((total, item) => total + (item || 0), 0);
};

export const average = (array, key = null) => {
  if (!Array.isArray(array) || array.length === 0) return 0;
  const total = sum(array, key);
  return total / array.length;
};

export const min = (array, key = null) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  if (key) {
    return Math.min(...array.map(item => item[key]));
  }
  return Math.min(...array);
};

export const max = (array, key = null) => {
  if (!Array.isArray(array) || array.length === 0) return null;
  if (key) {
    return Math.max(...array.map(item => item[key]));
  }
  return Math.max(...array);
};

export const shuffle = (array) => {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const paginate = (array, page = 1, limit = 10) => {
  if (!Array.isArray(array)) return { data: [], total: 0, page, limit, totalPages: 0 };
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = array.slice(start, end);
  return {
    data,
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
  };
};

export const insertAt = (array, index, item) => {
  if (!Array.isArray(array)) return [];
  const result = [...array];
  result.splice(index, 0, item);
  return result;
};

export const removeAt = (array, index) => {
  if (!Array.isArray(array)) return [];
  const result = [...array];
  result.splice(index, 1);
  return result;
};

export const move = (array, fromIndex, toIndex) => {
  if (!Array.isArray(array)) return [];
  const result = [...array];
  const [item] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, item);
  return result;
};

export default {
  chunk,
  unique,
  uniqueBy,
  groupBy,
  sortBy,
  filterBy,
  searchInArray,
  pluck,
  sum,
  average,
  min,
  max,
  shuffle,
  paginate,
  insertAt,
  removeAt,
  move,
};