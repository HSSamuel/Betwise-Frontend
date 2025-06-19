import { useState, useEffect } from "react";

/**
 * A custom hook to debounce a value.
 * @param {*} value The value to debounce.
 * @param {number} delay The delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay has passed
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
