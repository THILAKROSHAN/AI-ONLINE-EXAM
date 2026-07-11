import { useState, useMemo, useCallback } from 'react';

export const useSearch = (data, searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const value = getNestedValue(item, field);
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      });
    });
  }, [data, searchTerm, searchFields]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    filteredData,
    handleSearch,
    clearSearch,
  };
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export default useSearch;