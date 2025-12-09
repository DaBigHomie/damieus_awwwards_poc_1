import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery Hook', () => {
  beforeEach(() => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {}, // deprecated
        removeListener: () => {}, // deprecated
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  afterEach(() => {
    // Cleanup
  });

  it('should return false when media query does not match', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(result.current).toBe(false);
  });

  it('should return true when media query matches', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });

    const { result } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    expect(result.current).toBe(true);
  });

  it('should handle mobile screen query', () => {
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle tablet screen query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 769px) and (max-width: 1024px)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle desktop screen query', () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 1025px)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle color preference query', () => {
    const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle reduced motion query', () => {
    const { result } = renderHook(() => useMediaQuery('(prefers-reduced-motion: reduce)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle orientation query', () => {
    const { result } = renderHook(() => useMediaQuery('(orientation: portrait)'));
    expect(typeof result.current).toBe('boolean');
  });

  it('should return a stable boolean value', () => {
    const { result: result1 } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    const { result: result2 } = renderHook(() => useMediaQuery('(max-width: 600px)'));
    
    expect(typeof result1.current).toBe('boolean');
    expect(typeof result2.current).toBe('boolean');
  });

  it('should handle empty query string gracefully', () => {
    const { result } = renderHook(() => useMediaQuery(''));
    expect(typeof result.current).toBe('boolean');
  });

  it('should handle complex media queries', () => {
    const complexQuery = '(min-width: 768px) and (max-width: 1024px) and (orientation: portrait)';
    const { result } = renderHook(() => useMediaQuery(complexQuery));
    expect(typeof result.current).toBe('boolean');
  });
});
