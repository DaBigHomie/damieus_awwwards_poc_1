import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  it('should call callback after delay', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    
    act(() => {
      result.current('test');
    });
    
    expect(callback).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(300);
    
    expect(callback).toHaveBeenCalledWith('test');
    vi.useRealTimers();
  });

  it('should use default delay of 300ms', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback));
    
    act(() => {
      result.current('test');
    });
    
    vi.advanceTimersByTime(299);
    expect(callback).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledOnce();
    
    vi.useRealTimers();
  });

  it('should reset timer on multiple calls', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    
    act(() => {
      result.current('first');
    });
    
    vi.advanceTimersByTime(100);
    
    act(() => {
      result.current('second');
    });
    
    vi.advanceTimersByTime(100);
    expect(callback).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith('second');
    
    vi.useRealTimers();
  });

  it('should handle custom delay', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 500));
    
    act(() => {
      result.current('test');
    });
    
    vi.advanceTimersByTime(300);
    expect(callback).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledOnce();
    
    vi.useRealTimers();
  });

  it('should pass multiple arguments to callback', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    
    act(() => {
      result.current('arg1', 'arg2', 'arg3');
    });
    
    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
    
    vi.useRealTimers();
  });

  it('should handle rapid successive calls', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    
    act(() => {
      result.current(1);
      result.current(2);
      result.current(3);
      result.current(4);
      result.current(5);
    });
    
    vi.advanceTimersByTime(100);
    
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(5);
    
    vi.useRealTimers();
  });

  it('should work with object arguments', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    
    const obj = { name: 'test', value: 42 };
    
    act(() => {
      result.current(obj);
    });
    
    vi.advanceTimersByTime(300);
    expect(callback).toHaveBeenCalledWith(obj);
    
    vi.useRealTimers();
  });

  it('should handle zero delay', async () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 0));
    
    act(() => {
      result.current('test');
    });
    
    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledOnce();
    
    vi.useRealTimers();
  });
});
