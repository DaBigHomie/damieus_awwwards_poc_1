import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with initial value when key not in storage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));
    expect(result.current[0]).toBe('initial-value');
  });

  it('should retrieve value from localStorage if it exists', () => {
    localStorage.setItem('existing-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('existing-key', 'initial-value'));
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should handle objects as values', () => {
    const initialObject = { name: 'John', age: 30 };
    const { result } = renderHook(() => useLocalStorage('user', initialObject));
    
    act(() => {
      result.current[1]({ name: 'Jane', age: 25 });
    });
    
    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ name: 'Jane', age: 25 });
  });

  it('should handle arrays as values', () => {
    const initialArray = [1, 2, 3];
    const { result } = renderHook(() => useLocalStorage('items', initialArray));
    
    act(() => {
      result.current[1]([4, 5, 6]);
    });
    
    expect(result.current[0]).toEqual([4, 5, 6]);
    expect(JSON.parse(localStorage.getItem('items'))).toEqual([4, 5, 6]);
  });

  it('should handle null values', () => {
    const { result } = renderHook(() => useLocalStorage('nullable', 'initial'));
    
    act(() => {
      result.current[1](null);
    });
    
    expect(result.current[0]).toBeNull();
    expect(localStorage.getItem('nullable')).toBe(JSON.stringify(null));
  });

  it('should return initial value on JSON parse error', () => {
    localStorage.setItem('corrupt-key', 'invalid-json{');
    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'fallback'));
    expect(result.current[0]).toBe('fallback');
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('flag', false));
    
    act(() => {
      result.current[1](true);
    });
    
    expect(result.current[0]).toBe(true);
    expect(JSON.parse(localStorage.getItem('flag'))).toBe(true);
  });

  it('should handle number values', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    
    act(() => {
      result.current[1](42);
    });
    
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem('count'))).toBe(42);
  });

  it('should sync across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('shared-key', 'value1'));
    const { result: result2 } = renderHook(() => useLocalStorage('shared-key', 'value1'));
    
    expect(result1.current[0]).toBe('value1');
    expect(result2.current[0]).toBe('value1');
    
    act(() => {
      result1.current[1]('value2');
    });
    
    expect(result1.current[0]).toBe('value2');
  });
});
