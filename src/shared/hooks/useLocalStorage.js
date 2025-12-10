import { useState } from 'react';

/**
 * useLocalStorage Hook
 * 
 * Persists state to browser localStorage with automatic sync.
 * 
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if not in storage
 * @returns {[value, setValue]} State and setter (like useState)
 * 
 * @example
 * const [count, setCount] = useLocalStorage('count', 0);
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`useLocalStorage error for key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`useLocalStorage set error for key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
