import { useCallback, useEffect, useMemo, useRef } from "react";
import type { DebouncedFunction, DebounceOptions } from "./types";

/**
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @param options - Additional options for debouncing behavior
 * @returns A debounced version of the callback function
 * @example
 * ```tsx
 * const SearchInput = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const [results, setResults] = useState([]);
 *
 *   const searchAPI = useCallback(async (term: string) => {
 *     const response = await fetch(`/api/search?q=${term}`);
 *     const data = await response.json();
 *     setResults(data);
 *   }, []);
 *
 *   const debouncedSearch = useDebounce(searchAPI, 500);
 *
 *   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const value = e.target.value;
 *     setSearchTerm(value);
 *     debouncedSearch(value);
 *   };
 *
 *   return (
 *     <input
 *       type="text"
 *       value={searchTerm}
 *       onChange={handleChange}
 *       placeholder="Search..."
 *     />
 *   );
 * };
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay = 500,
  options: DebounceOptions = {},
): DebouncedFunction<T> => {
  const { maxWait, leading = false, trailing = true } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const funcRef = useRef(callback);
  const mountedRef = useRef(true);

  // Update the function reference when it changes
  useEffect(() => {
    funcRef.current = callback;
  }, [callback]);

  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  const invokeFunc = useCallback((time: number) => {
    const args = lastArgsRef.current;

    lastArgsRef.current = null;
    lastInvokeTimeRef.current = time;

    if (args && mountedRef.current) {
      funcRef.current(...args);
    }
  }, []);

  const startTimer = useCallback((pendingFunc: () => void, wait: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(pendingFunc, wait);
  }, []);

  const cancelTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const trailingEdge = useCallback(
    (time: number) => {
      cancelTimer();
      maxTimeoutRef.current = null;

      if (trailing && lastArgsRef.current) {
        return invokeFunc(time);
      }
      lastArgsRef.current = null;
    },
    [cancelTimer, invokeFunc, trailing],
  );

  const shouldInvoke = useCallback(
    (time: number): boolean => {
      const timeSinceLastCall = lastCallTimeRef.current
        ? time - lastCallTimeRef.current
        : 0;
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

      return (
        !lastCallTimeRef.current ||
        timeSinceLastCall >= delay ||
        timeSinceLastCall < 0 ||
        (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
      );
    },
    [delay, maxWait],
  );

  const timerExpired = useCallback(() => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }

    // Restart the timer
    const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
    const timeWaiting = delay - timeSinceLastCall;

    startTimer(timerExpired, timeWaiting);
  }, [delay, shouldInvoke, startTimer, trailingEdge]);

  const maxDelayedFunc = useCallback(() => {
    cancelTimer();
    maxTimeoutRef.current = null;
    if (lastArgsRef.current) {
      invokeFunc(Date.now());
    }
  }, [cancelTimer, invokeFunc]);

  const leadingEdge = useCallback(
    (time: number) => {
      // Set the max timer if maxWait is specified
      if (maxWait !== undefined && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(maxDelayedFunc, maxWait);
      }

      // Invoke the function on the leading edge if specified
      if (leading) {
        invokeFunc(time);
      }

      // Start the trailing edge timer
      startTimer(timerExpired, delay);
    },
    [
      delay,
      invokeFunc,
      leading,
      maxDelayedFunc,
      maxWait,
      startTimer,
      timerExpired,
    ],
  );

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgsRef.current = args;
      lastCallTimeRef.current = time;

      if (isInvoking) {
        if (!timeoutRef.current) {
          lastInvokeTimeRef.current = time;
          return leadingEdge(time);
        }
        if (maxWait !== undefined) {
          // Handle invocations in a tight loop
          startTimer(timerExpired, delay);
          return invokeFunc(time);
        }
      }
      if (!timeoutRef.current) {
        startTimer(timerExpired, delay);
      }
    },
    [
      delay,
      invokeFunc,
      leadingEdge,
      maxWait,
      shouldInvoke,
      startTimer,
      timerExpired,
    ],
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    lastInvokeTimeRef.current = 0;
    lastArgsRef.current = null;
    lastCallTimeRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      trailingEdge(Date.now());
    }
  }, [trailingEdge]);

  const pending = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  return useMemo(() => {
    const debouncedFunc = debounced as DebouncedFunction<T>;
    debouncedFunc.cancel = cancel;
    debouncedFunc.flush = flush;
    debouncedFunc.pending = pending;
    return debouncedFunc;
  }, [cancel, debounced, flush, pending]);
};
