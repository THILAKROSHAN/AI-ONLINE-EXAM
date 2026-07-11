import { useState, useMemo, useCallback } from 'react';

export const useFilter = (data, filterConfig = {}) => {
  const [filters, setFilters] = useState(filterConfig);

  const filteredData = useMemo(() => {
    let result = [...data];

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter(item => {
          const itemValue = getNestedValue(item, key);
          if (typeof value === 'string') {
            return String(itemValue).toLowerCase().includes(value.toLowerCase());
          }
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }
    });

    return result;
  }, [data, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMultipleFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const resetFilters = useCallback((defaultFilters = {}) => {
    setFilters(defaultFilters);
  }, []);

  return {
    filters,
    filteredData,
    setFilter,
    setMultipleFilters,
    clearFilters,
    resetFilters,
  };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useFilter;