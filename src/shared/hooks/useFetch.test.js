import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFetch } from './useFetch';

describe('useFetch Hook', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an object with required properties', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(result.current).toHaveProperty('data');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
  });

  it('should initialize with loading true', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(result.current.loading).toBe(true);
  });

  it('should initialize with null data', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(result.current.data).toBeNull();
  });

  it('should initialize with null error', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(result.current.error).toBeNull();
  });

  it('should provide refetch function', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(typeof result.current.refetch).toBe('function');
  });

  it('should accept URL parameter', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    renderHook(() => useFetch('/api/users'));
    
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should accept options parameter', () => {
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    renderHook(() => useFetch('/api/test', options));
    
    expect(global.fetch).toHaveBeenCalledWith('/api/test', options);
  });

  it('should have a refetch method that is callable', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetch('/api/test'));
    
    expect(() => {
      result.current.refetch();
    }).not.toThrow();
  });

  it('should handle different API endpoints', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/api/users' } }
    );
    
    expect(global.fetch).toHaveBeenCalledWith('/api/users', {});
  });

  it('should initialize loading state independently for different URLs', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    
    const { result: result1 } = renderHook(() => useFetch('/api/url1'));
    const { result: result2 } = renderHook(() => useFetch('/api/url2'));
    
    expect(result1.current.loading).toBe(true);
    expect(result2.current.loading).toBe(true);
  });
});
