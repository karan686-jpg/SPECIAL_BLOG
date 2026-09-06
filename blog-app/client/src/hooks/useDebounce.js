import { useState, useEffect } from "react";

/**
 * ⚡ Custom useDebounce Hook
 * Delays updating the returned value until after the specified delay has passed
 * since the last time the value changed.
 *
 * Perfect for search bars, auto-save drafts, API calls, and window resize listeners!
 *
 * @param {*} value - The fast-changing value (e.g., search text)
 * @param {number} delay - Delay in milliseconds (default: 350ms)
 * @returns {*} The stable, debounced value
 */
export function useDebounce(value, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timer to update debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 🧹 Cleanup: if the user types again before delay finishes, clear the old timer!
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
