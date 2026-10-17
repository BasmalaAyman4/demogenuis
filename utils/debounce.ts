/* // utils/debounce.ts

/**
 * Debounce function to limit API calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 *
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit execution rate
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 *
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
} */

// utils/debounce.ts

/**
 * Enhanced debounce with leading/trailing options
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @param options - Configuration options
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true, maxWait } = options;

  let timeout: NodeJS.Timeout | null = null;
  let maxTimeout: NodeJS.Timeout | null = null;
  let lastCallTime: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T> | undefined;

  function invokeFunc(time: number) {
    const args = lastArgs!;
    lastArgs = null;
    lastInvokeTime = time;
    result = func(...args);
    return result;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function leadingEdge(time: number) {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number) {
    timeout = null;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null;
    return result;
  }

  function cancel() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    if (maxTimeout !== null) {
      clearTimeout(maxTimeout);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = null;
    timeout = null;
    maxTimeout = null;
  }

  function flush() {
    return timeout === null ? result : trailingEdge(Date.now());
  }

  function debounced(...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
}

/**
 * Enhanced throttle with leading/trailing options
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @param options - Configuration options
 * @returns Throttled function with cancel method
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300,
  options: {
    leading?: boolean;
    trailing?: boolean;
  } = {}
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  return debounce(func, limit, {
    leading: options.leading !== false,
    trailing: options.trailing !== false,
    maxWait: limit,
  });
}

/**
 * React hook for debounced value
 * Usage: const debouncedValue = useDebounce(value, 300)
 */
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React hook for debounced callback
 * Usage: const debouncedFn = useDebouncedCallback(fn, 300)
 */
import { useCallback, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  options?: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  }
) {
  const callbackRef = useRef(callback);
  const debouncedRef = useRef<ReturnType<typeof debounce> | null>(null);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Create debounced function
  if (!debouncedRef.current) {
    debouncedRef.current = debounce(
      (...args: Parameters<T>) => callbackRef.current(...args),
      delay,
      options
    );
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedRef.current?.cancel();
    };
  }, []);

  return debouncedRef.current;
}