import { useCallback, useRef } from 'react';

/**
 * useDebounce Hook
 * 
 * Debounces a callback function to prevent excessive calls.
 * Useful for search inputs, resize handlers, etc.
 * 
 * @param {function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300)
 * @returns {function} Debounced callback
 * 
 * @example
 * const debouncedSearch = useDebounce((query) => {
 *   // Search API call
 * }, 500);
 */
export const useDebounce = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};
