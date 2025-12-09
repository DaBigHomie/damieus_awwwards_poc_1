import { useState, useCallback, useEffect } from 'react';

/**
 * useFetch Hook
 * 
 * Simplified data fetching with loading and error states.
 * 
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {object} { data, loading, error, refetch }
 * 
 * @example
 * const { data, loading, error } = useFetch('/api/users');
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
